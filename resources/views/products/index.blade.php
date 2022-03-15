<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
		  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" href="reset.css">
	<link rel="stylesheet" href="style.css">
	<title>Товары</title>
</head>
<body>
<div class="container">
	<div class="products">
	<!--	<div class="productsHeader">
			<div class="headerText">
				Товары
			</div>
			<div class="productsSearch">
				<input type="text" placeholder="Поиск по товарам">
			</div>
		</div> 
		<div class="productsBody">
			<div class="productsCategories">
				<div class="productsCategory">
					Роллы
				</div>
				<div class="productsCategory">
					Пицца
				</div>
				<div class="productsCategory">
					Напитки
				</div>
			</div>-->
			<div class="productsTable">
				<div class="tableHeader">
					<div class="categoryName">
						Роллы
					</div>
					<a href="{{ route('productCreate') }}">
					<div class="button">
						Новый товар
					</div>
					</a>
				</div>
				<div class="tableBody">
					<div class="headersRow">
						<div class="productName">Название</div>
						<div class="productPrice">Цена</div>
						<div class="productMeasureItems">Ед.</div>
						<div class="productArticul">Артикул</div>
						<!--<div class="productSale">Скидка</div>-->
						<div class="productIngredients">Состав</div>
						<div class="productStop">Стоп-лист</div>
					</div>
					@for ($i = 0; $i < count($products); $i++)
					<div class="tableRow">
						<div class="productName">{{$products[$i]['name']}}</div>
						<div class="productPrice">{{$products[$i]['price']}}</div>
						<div class="productMeasureItems">{{$products[$i]['unit']}}</div>
						<div class="productArticul">{{$products[$i]['art']}}</div>
						<!--<div class="productSale">Да</div>-->
						<div class="productIngredients">{{$products[$i]['description']}}</div>
						
						<div class="productStop">
							<input type="checkbox">
							<a href="">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
								 style="fill: red;">
								<path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
							</svg>
							</a>
							<a href="">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
								 style="fill: #354AFF;">
								<path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path>
							</svg>
							</a>
						</div>
					</div>
					@endfor
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>


<style>
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
    padding-top: 15px;
    padding-bottom: 15px;
}
.products {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 100%;
    border-radius: 4px;
    padding: 10px;

}
.productsHeader {
    display: flex;
    justify-content: space-between;
    font-size: 22px;
    font-weight: bold;
    align-items: center;
}
.productsSearch {
    font-size: 16px;
}
.productsSearch > input {
    background-color: #f2f2f2;
    border: 0;
    padding: 5px 10px;
    border-radius: 4px;
}
.productsBody {
    display: flex;
}
.productsCategories {
    min-width: 150px;
    width: max-content;
    font-size: 18px;
}
.productsTable {
    font-size: 18px;
    display: flex;
    flex-direction: column;
    width: 100%;
}
.tableHeader {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.categoryName {
    margin-right: 10%;
}
.button {
    padding: 5px 10px;
    text-align: center;
    display: flex;
    align-items: center;
    border-radius: 4px;
    background-color: #354AFF;
    color: #fff;
}
.tableBody {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: #f2f2f2;
}
.headersRow {
    display: flex;
    justify-content: space-between;
    border-radius: 4px 4px 0 0;
    background-color: #e7e7e7;
    padding: 5px 10px;
}
.tableRow {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

}
.productName {
    width: 150px;
}
.productPrice {
    width: 50px;
}
.productMeasureItems {
    width: 30px;
}
.productArticul {
    width: 40px;
}
.productSale {
    width: 65px;
}
.productIngredients {
    width: 250px;
}
.productStop {
    width: 90px;
}

</style>