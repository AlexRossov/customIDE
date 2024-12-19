Данный проект написан на Next.js.

Для запуска проекта локально нужно скачать код и выполнить последовательно следующие команды:
npm install
npm run dev

Приложение запустится по адресу: http://localhost:3000

На vercel приложение работает по адресу: ...

Задача: реализовать упрощённый интерфейс редактора кода, который будет подсвечивать синтаксис языков программирования. Выполнять код и выводить результаты в консоль.

В данном проекте предложен выбор между JS и PHP. При смене языка подсветка синтаксиса меняется.

JS код выполняется посредством отправки POST запроса по адресу "/api/execute", там реализован скрипт, который выполняет код и возвращает результат на консоль.

PHP не выполняется, поскольку это серверный язык и реализация его выполнения выходит за рамки текущего задания.

Редактор кода реализован с помощью библиотеки - codemirror.

Консоль реализована с помощью библиотеки - console-feed.

Для безопасности предусмотрена минимальная валидация для JS, но она условна, поскольку для других языков нужно искать другие решения. В идеале изолировать среду выполнения каждого языка с помощью docker-sandbox.

В приложение легко добавить новые языки.

Добавлены кнопки запуска выполнения кода, а так же очистки поля ввода и консоли для удобства.

Данные редактора кода сохраняются в localStorage с задержкой 300 мс.
