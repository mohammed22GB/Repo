import { INTEGRATIONS_WITHOUT_RESOURCES } from "../../../../Integrations/utils/integrationsWithoutResources";

export const groupIntegrations = (integrationList, groupArray = false) => {
  const grouped_integrations = {};

  if (groupArray) {
    if (integrationList?.length)
      integrationList
        ?.filter(
          (intg) =>
            INTEGRATIONS_WITHOUT_RESOURCES.includes(intg.properties?.type) ||
            !!intg.properties?.resources?.length
        )
        ?.forEach((intg) => {
          if (grouped_integrations[intg.group])
            grouped_integrations[intg.group].push({
              id: intg.id,
              name: intg.name,
              type: intg.properties.type,
              resources: intg?.properties?.resources,
            });
          else
            grouped_integrations[intg.group] = [
              {
                id: intg.id,
                name: intg.name,
                type: intg.properties.type,
                resources: intg?.properties?.resources,
              },
            ];
        });
  } else {
    integrationList
      ?.filter(
        (intg) =>
          INTEGRATIONS_WITHOUT_RESOURCES.includes(intg.properties?.type) ||
          !!intg.properties?.resources?.length
      )
      ?.forEach((intg) => {
        //  "type" to be refactored to "group"
        let ress = {};

        intg?.properties?.resources?.forEach((res) => {
          ress[res.name] = res;
        });

        if (!grouped_integrations?.[intg.group]) {
          grouped_integrations[intg.group] = {
            [intg.id]: {
              name: intg.name,
              type: intg.properties.type,
              resources: ress,
            },
          };
        } else {
          grouped_integrations[intg.group][intg.id] = {
            name: intg.name,
            type: intg.properties.type,
            resources: ress,
          };
        }
      });
  }

  return grouped_integrations;
};
