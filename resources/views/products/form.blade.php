<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
		  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" href="reset.css">
	<link rel="stylesheet" href="form.css">
	<title>Document</title>
</head>
<body>
<div class="container">
	<div class="form">

		<form method="POST" action="/product/add">
			@csrf
			<div class="formHeader">Добавить новый товар</div>
			<div class="formItem">
				<label for="category">
					Категория
				</label>
				<select id="category" name="category">
					@foreach ($categories as $category)
					<option>{{$category->name}}</option>
					@endforeach
				</select>
			</div>
			<div class="formItem">
				<label for="name">
					Название
				</label>
				<input type="text" id="name" name="name">
			</div>
			<div class="formItem">
				<label for="articul">
					Артикул
				</label>
				<input type="text" id="articul" name="articul">
			</div>
			<div class="formItem">
				<label for="price">
					Цена
				</label>
				<input type="text" id="price" name="price">
			</div>
			<div class="formItem">
				<label for="description">
					Описание
				</label>
				<input type="text" id="description" name="description">
			</div>
			<div class="formItem">
				<label for="measureItem">
					Единица
				</label>
			<!--	<select id="measureItem">
					<option>шт.</option>
					<option>г.</option>
					<option>кг.</option>
					<option>л.</option>
				</select>-->
			</div>
			<button class="button" type="submit">Добавить товар</button>
		</form>
	</div>
</div>
</body>
</html>

<style>
	@media screen and (max-width: 1920px) {
    .container{
        width: 1600px;
    }
}
@media screen and (max-width: 1600px) {
    .container{
        width: 1400px;
    }
}
@media screen and (max-width: 1366px) {
    .container{
        width: 1200px;
    }
}
@media screen and (max-width: 1040px) {
    .container {
        width: 940px;
    }
}
@media screen and (max-width: 800px) {
    .container {
        width: 700px;
    }
}
* {
    font-family: 'Nunito', sans-serif;
}
body {
    background-color: #f2f2f2;
    height: 100vh;
}
.container {
    height: 100%;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
}
.form {
    width: 40%;
}
.form > form {
    display: flex;
    flex-direction: column;
    font-size: 20px;
}
.formItem {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
}
.formItem > select {
    width: 80%;
    background-color: #e7e7e7;
    border: 0;
}
.formItem > input {
    border-radius: 4px;
    background-color: #e7e7e7;
    border: 0;
}
.form {
    background-color: white;
    border-radius: 4px;
    margin-left: auto;
    margin-right: auto;
    padding: 10px 10px;
}
select {
    font-size: 18px;
}
.button {
    padding: 5px 10px;
    text-align: center;
    display: flex;
    align-items: center;
    border-radius: 4px;
    background-color: #354AFF;
    color: #fff;
    border: 0;
}
.formHeader {
    font-weight: bold;
}

/* Указываем box sizing */
*,
*::before,
*::after {
    box-sizing: border-box;
}

/* Убираем внутренние отступы */
ul[class],
ol[class] {
    padding: 0;
}

/* Убираем внешние отступы */
body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
li,
figure,
figcaption,
blockquote,
dl,
dd {
    margin: 0;
}

/* Выставляем основные настройки по-умолчанию для body */
body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
}

/* Удаляем стандартную стилизацию для всех ul и il, у которых есть атрибут class*/
ul[class],
ol[class] {
    list-style: none;
}

/* Элементы a, у которых нет класса, сбрасываем до дефолтных стилей */
a:not([class]) {
    text-decoration-skip-ink: auto;
}

/* Упрощаем работу с изображениями */
img {
    max-width: 100%;
    display: block;
}

/* Указываем понятную периодичность в потоке данных у article*/
article > * + * {
    margin-top: 1em;
}

/* Наследуем шрифты для инпутов и кнопок */
input,
button,
textarea,
select {
    font: inherit;
}

/* Удаляем все анимации и переходы для людей, которые предпочитай их не использовать */

</style>