export const hashPasswordAndUsername = async (username, password) => {
    const encoder = new TextEncoder();
    const usernameData = encoder.encode(username);
    const passwordData = encoder.encode(password);
  
    const usernameHashBuffer = await crypto.subtle.digest('SHA-256', usernameData);
    const passwordHashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
  
    const usernameHashArray = Array.from(new Uint8Array(usernameHashBuffer));
    const passwordHashArray = Array.from(new Uint8Array(passwordHashBuffer));
  
    const combinedData = [...usernameHashArray, ...passwordHashArray];
    const combinedDataBuffer = new Uint8Array(combinedData);
  
    const combinedHashBuffer = await crypto.subtle.digest('SHA-256', combinedDataBuffer);
    const combinedHashArray = Array.from(new Uint8Array(combinedHashBuffer));
    
    return combinedHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };