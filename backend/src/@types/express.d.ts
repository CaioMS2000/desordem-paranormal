import type { ApplicationResources } from "@/http/app";
import type { BuildService } from "@/services/build-service";

declare global {
  namespace Express {
    interface Locals {
      resources: ApplicationResources;
      buildService: BuildService;
    }
  }
}