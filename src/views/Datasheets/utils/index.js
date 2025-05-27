import { filterDuplicateObjects } from "../../common/helpers/helperFunctions";

export const compareByNameAndId = (obj1, obj2) => {
  return obj1?.name === obj2?.name && obj1?.id === obj2?.id;
};

export const compareByValue = (obj1, obj2, property) => {
  return obj1?.[property] === obj2?.[property];
};

export const filterDuplicateItems = (arr) => {
  return arr?.filter((val, index) => arr.indexOf(val) === index);
};

export const groupPermissionsByAccess = (arrItems) => {
  const groupedObjects = arrItems?.reduce((groups, obj) => {
    // if (obj.identity !== "role" && obj.identity !== "userGroup") {
    obj.id = obj.value;
    obj.permissionIdentityType =
      obj?.identity?.[0]?.toUpperCase() + obj?.identity?.substring(1);
    if (!groups[obj.access]) {
      groups[obj.access] = [];
    }
    groups[obj.access].push(obj);
    // }
    return groups;
  }, {});

  for (let key in groupedObjects) {
    groupedObjects[key] = filterDuplicateObjects(
      groupedObjects[key],
      compareByNameAndId
    );
  }

  return groupedObjects;
};
