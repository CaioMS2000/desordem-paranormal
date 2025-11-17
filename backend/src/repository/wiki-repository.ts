// public static async GetAllInfo() {
//   // retornar um array de objetos com todas as páginas e suas conexões

//   const allPages = await this.GetPagesObjs();
//   const allPagesObjects: pagesObjInterface[] = [];
//   if (!allPages) {
//     throw new Error("deu erro no allPages");
//   }

//   for (const page of allPages) {
//     const connections = await this.GetPageConnections(page.html, allPages);
//     const hash = new HtmlHasher().hasher(page.html);

//     allPagesObjects.push({
//       id: page.id,
//       name: page.name,
//       html: hash,
//       link: page.link,
//       connections: connections,
//     });
//   }
// }
export class WikiRepository {}
