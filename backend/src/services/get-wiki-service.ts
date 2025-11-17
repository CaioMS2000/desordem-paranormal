import { WikiDataManipulationService } from "./wiki-data-manipulation-service";

export interface pagesObjInterface {
  id: number;
  name: string;
  link: string;
  html: string;
  connections?: number[];
}
//talvez tirar esses objetos de arrays e passar eles diretamente pro banco?
export class GetWikiService {
  public static async GetPagesObjs() {
    const allPagesObjects: pagesObjInterface[] = [];
    const pageRecords = await WikiDataManipulationService.GetPagesByPageNames();

    if (!pageRecords) {
      throw new Error("deu erro no GetAllPages da service");
    }

    for (const [pageid, page] of pageRecords) {
      const pageObj: pagesObjInterface = {
        id: page.raw.pageid,
        name: page.raw.title,
        link: page.raw.fullurl,
        html: await page.html(),
      };
      allPagesObjects.push(pageObj);
    }
    return allPagesObjects;
  }

  public static async GetConnectionsObjs(
    htmlPage: string,
    allPages: pagesObjInterface[]
  ) {
    const connections: number[] = [];

    const getPageConnections =
      await WikiDataManipulationService.GetPageConnections(htmlPage);

    for (const entrie of getPageConnections) {
      const pageObj = allPages.find((page) => {
        return page.name == entrie[1];
      });

      if (!pageObj) {
        continue;
      }
      connections.push(pageObj.id);
    }

    return connections;
  }
}
