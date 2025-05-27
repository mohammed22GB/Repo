import { getIntegrationResourcesListAPI } from "../../../../views/Integrations/utils/integrationsAPIs";

describe("getIntegrationResourcesListAPI", () => {
  it("should throw an error if id is not a string", async () => {
    await expect(
      getIntegrationResourcesListAPI({ queryKey: [null, { id: 123 }] })
    ).resolves.toMatchObject({ data: [] });
  });
});
