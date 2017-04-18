import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';

@Injectable()
export class DatasetService {

  private proteomicsList = "pride,peptideatlas,peptide_atlas,massive,PRIDE,PeptideAtlas,MassIVE, Massive, gpmdb, GPMDB, GPMdb,LINCS,LINCS,paxdb,PAXDB,jpost,JPOST Repository";
  private metabolomicsList = "MetaboLights Dataset, MetaboLights,metabolights,metabolights_dataset,MetabolomicsWorkbench, Metabolomics Workbench, metabolomics_workbench, metabolome_express, MetabolomeExpress, Metabolomics Workbench, GNPS, gnps";
  private transcriptomicsList = "ArrayExpress, arrayexpress-repository, ExpressionAtlas, expression-atlas, atlas-experiments, Expression Atlas Experiments, atlas-experiments";
  private genomicsList = "ega,EGA";

  constructor(private appConfig: AppConfig) { }

  public getWebServiceUrl(): string {
    return this.appConfig.getWebServiceUrl();
  }

  public getProteomicsList(): string {
    return this.proteomicsList;
  }

  public getMetabolomicsList(): string {
    return this.metabolomicsList;
  }

  public getGenomicsList(): string {
    return this.genomicsList;
  }

  public getTranscriptomicsList(): string {
    return this.transcriptomicsList;
  }
}
