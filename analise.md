## Problema
1. **WikiOp.ts** - apenas faz chamadas para a API externa (wikijs)
2. **DataSetService.ts** - tem lógica de negócio MAS está fortemente acoplada com chamadas externas
3. **Controller** - é um placeholder
4. **Repository** - está vazio

O problema é claro: **falta separação de responsabilidades**. Tudo está misturado - lógica de negócio, chamadas externas, parsing de HTML.

Para ter testes unitários bons, você precisa de:
- Funções puras quando possível
- Dependências injetadas (não hardcoded)
- Separação entre lógica de negócio e I/O
- Funções com responsabilidade única

## Problema na arquitetura
o problema é que **quase tudo depende de I/O externo**:

```typescript
// WikiOp - chamadas HTTP diretas
public static async GetPageNames() {
  const pageNames = await wiki({ // ⚠️ Dependência hardcoded
    apiUrl: "https://ordemparanormal.fandom.com/api.php"
  }).allPages();
}

// DataSetService - depende da WikiOp que depende da API
public static async GetAllPages() {
  const pageNames = await WikiOp.GetPageNames(); // ⚠️ Não injetável
  // ...
}
```

**O que você TEM no código:**
- 🔴 Chamadas HTTP hardcoded
- 🔴 Lógica de negócio misturada com I/O
- 🔴 Métodos estáticos (difícil de mockar)
- 🔴 Sem injeção de dependências

**O que seria TESTÁVEL:**
- ✅ Lógica pura separada
- ✅ Dependências injetáveis
- ✅ Funções com responsabilidade única
- ✅ Transformações de dados isoladas

---

### ❌ Código Atual (NÃO testável unitariamente)

```typescript
public static async GetPageConnections(pageName: string) {
  const getPage = await WikiOp.getPage(pageName); // I/O
  const htmlPage = await getPage?.html(); // I/O
  const page = cheerio.load(htmlPage ?? ""); // OK
  const links = page("a").toArray(); // OK
  const connections: number[] = [];
  const allPagesRecord: Record<string, string> = {};

  for (const element of links) {
    const attr = element.attribs;
    if (
      !attr.href?.startsWith("/") ||
      attr.href.startsWith("/wiki/Arquivo:")
    ) {
      continue;
    }
    allPagesRecord[attr.href] = attr.title!;
  }
  
  // Mais I/O em loop...
  return connections;
}
```

**Problemas:**
1. Mistura I/O (fetch) com lógica (filtrar links)
2. Não dá pra testar a lógica de filtrar links sem fazer request real
3. Não dá pra testar se está filtrando corretamente

---

## A Solução Implementada

Após identificar os problemas, refatoramos o código aplicando os princípios de separação de responsabilidades e injeção de dependências.

### Mudanças Arquiteturais

1. **Injeção de Dependências** - `DataSetService` agora recebe `IWikiClient` via construtor
2. **Interface de Abstração** - Criado `IWikiClient` para desacoplar da implementação
3. **Funções Puras Extraídas** - `isValidWikiLink()`, `extractWikiLinks()`, `linksToPageIds()`
4. **Separação I/O de Lógica** - I/O no `WikiClientAdapter`, lógica nas funções puras

### Estrutura Criada

```
backend/src/
├── models/
│   ├── page.model.ts              # Interfaces de dados
│   └── wiki-client.interface.ts   # Interface IWikiClient
├── utils/
│   ├── wiki-link-validator.ts     # Validação pura
│   └── wiki-link-parser.ts        # Parsing puro
├── infrastructure/
│   └── wiki-client-adapter.ts     # Adapter para wikijs
├── services/
│   └── data-set-service.ts        # Service com DI
└── __tests__/unit/
    ├── wiki-link-validator.test.ts
    └── wiki-link-parser.test.ts
```

### Código Real (com melhorias)

**isValidWikiLink** - mais robusto que o planejado:

```typescript
export function isValidWikiLink(href?: string): boolean {
  if (!href) return false;

  // Rejeita URLs externas e protocol-relative
  if (href.startsWith("//")) return false;
  if (href.startsWith("http://")) return false;
  if (href.startsWith("https://")) return false;

  if (!href.startsWith("/")) return false;

  // Rejeita páginas especiais (PT e EN)
  if (href.startsWith("/wiki/Arquivo:")) return false;
  if (href.startsWith("/wiki/Especial:")) return false;
  if (href.startsWith("/wiki/Special:")) return false;
  if (href.startsWith("/wiki/Categoria:")) return false;
  if (href.startsWith("/wiki/Category:")) return false;

  return true;
}
```

**DataSetService** - com DI:

```typescript
export class DataSetService {
  constructor(private readonly wikiClient: IWikiClient) {}

  async getPageConnections(pageName: string): Promise<number[]> {
    const wikiPage = await this.wikiClient.getPage(pageName);
    if (!wikiPage) throw new Error(`Page not found: ${pageName}`);

    const html = await wikiPage.html();

    // Funções puras testáveis
    const links = extractWikiLinks(html);
    const pageMap = await this.buildPageMap(Object.values(links));
    return linksToPageIds(links, pageMap);
  }
}
```

### Padrão MVC Mantido

- **Model**: Interfaces em `/models`
- **Controller**: `DataSetController` gerencia requisições HTTP
- **Service**: Lógica de negócio com dependências injetadas
- **Infrastructure**: Adaptadores para APIs externas

### Resultado

- ✅ **27 testes unitários** passando
- ✅ **TypeScript** sem erros
- ✅ **Tempo**: ~0.5s para todos os testes
- ✅ **Arquitetura** testável e manutenível

---

## Nuance: Testes com Cheerio

**Questão:** Usar `cheerio.load()` nos testes os torna testes de integração?

### A Resposta: São Testes Unitários

**Cheerio é uma ferramenta, não uma dependência externa.** É como usar `Array.map()` ou `JSON.parse()`:

- **Sem I/O** - Não faz rede, filesystem, ou operações externas
- **Rápido** - Operação síncrona em memória
- **Determinístico** - Mesmo input = mesmo output
- **Biblioteca utilitária** - Transforma dados, não integra sistemas

Você não mocka `Array.map()` quando testa arrays. O mesmo vale para Cheerio.

### Por Que Isso Importa para Web Scraping

- **HTML é seu input primário** - faz sentido testar com HTML real
- **Parsing é core** - você QUER garantir que funciona
- **Cheerio é estável** - biblioteca madura e confiável

Mockar seria contraproducente:

```typescript
// ❌ Teste ruim - testa implementação
const mockLoad = jest.fn().mockReturnValue({...});
expect(mockLoad).toHaveBeenCalled();  // Testa "se chamou", não "se funciona"
```

### Distinção: Unit vs Integration

**✅ Unit (o que temos):**
- Input: strings HTML sintéticas
- Sem I/O, rápido, isolado
- Testa lógica de negócio

```typescript
extractWikiLinks('<a href="/wiki/Test">Link</a>');
```

**❌ Integration (o que seria):**
- HTTP real para API externa
- Depende de rede e serviços

```typescript
const service = new DataSetService(new WikiClientAdapter(realApiUrl));
await service.getPageConnections("RealPage");  // HTTP de verdade
```

### Resultado Prático

- **27 testes** em ~0.5s
- **Confiança** com HTML real
- **Simplicidade** - fácil ler e manter
- **Robustez** - não quebram com refactoring

**Conclusão:** Para web scraping, Cheerio em testes unitários é pragmatismo bem aplicado sobre purismo excessivo.