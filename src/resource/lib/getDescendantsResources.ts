import { Resource } from "../entities/resource.entity";

export const getDescendantResources = (
  resources: Resource[],
  parentId: number
) => {
  let descendantResources = [];

  for (const resource of resources) {
    if (resource.parentId === parentId || resource.id === parentId) {
      descendantResources.push(resource);
      descendantResources = descendantResources.concat(
        getDescendantResources(resources, resource.id)
      );
    }
  }

  return descendantResources;
};
