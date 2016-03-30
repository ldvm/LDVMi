export default function createConfiguratorRoutes(definition, createRoutes) {
  createRoutes.visualizer = definition;
  return createRoutes;
}