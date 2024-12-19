export async function POST(req) {
  try {
    // Чтение и разбор запроса
    const { code, language } = await req.json();

    // Проверка, что язык - JavaScript
    if (language !== 'javascript') {
      return Response.json(
        { status: 'error', error: 'Поддерживается только выполнение JavaScript.' },
        { status: 400 }
      );
    }

    // Выполнение кода
    let output = '';
    try {
      // Захватываем вывод из console.log()
      const log = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        log.push(args.join(' '));
      };

      const safeFunction = new Function(code);
      safeFunction(); // Выполняем код

      // Восстанавливаем console.log
      console.log = originalConsoleLog;

      output = log.join('\n') || 'Выполнение успешно завершено.';
    } catch (executionError) {
      return Response.json(
        { status: 'error', error: executionError.message },
        { status: 400 }
      );
    }

    // Успешный ответ
    return Response.json({ status: 'success', output });
  } catch (error) {
    return Response.json(
      { status: 'error', error: 'Неверный формат запроса или ошибка сервера.' },
      { status: 500 }
    );
  }
}
