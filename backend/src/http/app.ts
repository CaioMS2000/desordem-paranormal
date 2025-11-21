import express from "express";
import type { BuildService } from "@/services/build-service";
import type { WikiService } from "@/services/wiki-service";

export type ApplicationResources = {
    wikiService: WikiService;
    buildService: BuildService;
}

export const app = express()
