export function validateItemId(itemid) {
    try {
      // Allowed characters: Latin, Cyrillic, numbers, - _ , . : ;
      const pattern = /^[a-zA-Zа-яА-ЯёЁ0-9_\-.,:;]+$/;
  
      return (
        itemid &&
        itemid.length > 0 &&
        itemid.length < 50 &&
        pattern.test(itemid)
      );
    } catch {
      return false;
    }
  }
  