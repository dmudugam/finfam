// src/api/googleSheetsApi.ts
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/xcaj23av1kc35';

export async function fetchSheetData() {
  const response = await fetch(`${SHEETDB_API_URL}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function updateSheetData(last4Digits: string, updatedData: any) {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/last_4_digits/${last4Digits}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: updatedData }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}