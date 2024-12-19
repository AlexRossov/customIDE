export const executeCode = async (code, language) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  });

  return await response.json();
};