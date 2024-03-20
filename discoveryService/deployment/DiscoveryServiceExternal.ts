import { ExtendedGroupEndpoints, GateWayGroup } from "../../../cdk-ts-common/types";
import * as ENUMS from "../../../cdk-ts-common/enums";
import { DiscoveryServiceDefaultData } from "../../../cdk-ts-common/deployment/discoveryServiceDefaultData";
import { App } from "../../../cdk-ts-common/deployment/node_modules/aws-cdk-lib";
import * as fs from "fs";
import { DiscoveryServiceStackBase } from "../../../cdk-ts-common/deployment/DiscoveryServiceStackBase";
import path from "path";

const extendedGroupEndpoints: ExtendedGroupEndpoints = JSON.parse(fs.readFileSync("../inputs/inputs.json", "utf-8"));

export class DiscoveryServiceExternal extends DiscoveryServiceStackBase {
  protected apiGatewayObj: GateWayGroup;
  constructor(
    scope: App,
    id: string,
    props: {
      [gatewayGroup: string]: GateWayGroup;
    }
  ) {
    super(scope, id);

    this.defaultData = new DiscoveryServiceDefaultData(extendedGroupEndpoints);
    this.defaultData.initializeValues();

    this.apiGatewayObj = Object.values(props)[0];
    this.apiGatewayName = Object.keys(props)[0];
    this.stage = this.apiGatewayObj.stage;
    this.resourceName = this.apiGatewayObj.endpointsInfoArray[0].resourceName;
    this.endpoints = this.apiGatewayObj.endpointsInfoArray;
    this.isAuthorizationExists = this.apiGatewayObj.features[ENUMS.ApiFeatures.Authorization];
    this.mappingDomain = this.apiGatewayObj.serverUrl!;
    this.separateHostedZones = this.apiGatewayObj.separateHostedZones!;
    this.lambdaFolderPath = path.join(__dirname, "../lambda");
  }
}


