const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_DEVELOPMENT_URL;


export async function fetchGroups() {
  const response = await fetch(`${API_BASE_URL}/api/groups`);
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  return response.json();
}

export async function fetchGroup(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/groups/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch group');
  }
  return response.json();
}

export async function createGroup(data: any) {
  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create group');
  }
  return response.json();
}

export async function updateGroup(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update group');
  }
  return response.json();
}

export async function deleteGroup(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete group');
  }
  return response.json();
}

export async function fetchExpenses(groupId?: string) {
  const url = groupId
    ? `${API_BASE_URL}/api/expenses?groupId=${groupId}`
    : `${API_BASE_URL}/api/expenses`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return response.json();
}

export async function fetchExpense(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch expense');
  }
  return response.json();
}

export async function createExpense(data: any) {
  const response = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create expense');
  }
  return response.json();
}

export async function updateExpense(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update expense');
  }
  return response.json();
}

export async function deleteExpense(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete expense');
  }
  return response.json();
}