export async function POST(req) {
  try {
    // Парсим тело запроса
    const { code, language } = await req.json();

    // Проверяем язык
    if (language !== 'javascript') {
      return Response.json(
        { success: false, error: 'Only JavaScript execution is supported.' },
        { status: 400 }
      );
    }

    // Исполняем код безопасно
    let result = '';
    try {
      const safeFunction = new Function(code);
      result = safeFunction();
    } catch (executionError) {
      return Response.json(
        { success: false, error: executionError.message },
        { status: 400 }
      );
    }

    // Возвращаем результат
    return Response.json({ success: true, result: result ?? 'Execution completed successfully.' });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Invalid request format.' },
      { status: 500 }
    );
  }
}
