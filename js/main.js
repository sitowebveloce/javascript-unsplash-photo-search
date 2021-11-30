// Unsplash dev key
import {un_key} from './unk.js';
const unsplash_access_k = un_key();

const unsplash_url = 'https://api.unsplash.com';
// const unsplash_url_auth = 'https://unsplash.com/oauth/authorize';

// Select elements
let container = document.querySelector('.container');
let pagination = document.querySelector('.pagination');
let searchform = document.querySelector('form');
let searchInput = document.querySelector('.search_input');

// HEADER OBJ GET
let headerObjGet = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Client-ID ${unsplash_access_k}`
			}
		};

// SEARCH STRING
let searchText = 'Love';

// Pagination
let page = 1;
let totalPages = 0;
// totalPages = data.total_pages / perPage;
// let perPage = 10;

// FETCH FN
async function searchPhotos (photo, page){

	try{
		const searchUrl = `${unsplash_url}/search/photos?query=${photo}&page=${page}`;
		const res = await fetch(searchUrl, headerObjGet);

		let data = await res.json();
		totalPages = data.total_pages;
		// console.log(`Total Pages: ${data.total_pages}`);

		// CONTAINER RESET
		container.innerHTML = '';
		
		// LOOP AND APPEND
		data.results.forEach( function(photo, index, arr) {
			// CREATE A FRAGMENT
			let fragment = document.createDocumentFragment();			
			// Create a div
			let div = document.createElement('div');
			// Add Class
			div.classList.add('card');
			// CHECK COLOR DARKNESS
			let col = colorDark(photo.color);
			// console.log(col);

			// URL
			// console.log(photo.urls)
			// let urlImgOne = photo.urls.full.split('?')[0];
		    // let urlImgTwo = photo.urls.full.split('?')[1];
		    // let border = `?border=13%2C55${photo.color.replace('#','')}&`;
			// let fit = `ar=1:1&fit=crop&`;
			// let size = `w=800&`;
			// let bg = `bg=${photo.color.replace('#','')}&`
		    //    let text = `txt=${photo.user.name}&txt-size=23&txt-color=${col}&txt-align=bottom,right&txt-font=Futura%20Condensed%20Medium&`;
		    
		    // let urlImgFull= `${urlImgOne}${border}${fit}${size}${bg}${text}${urlImgTwo}`;
		    // console.log(`URL: ${urlImgFull}`);
		    
		    // console.log(photo)
		    div.innerHTML =  `
		    <div class='username' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}">Name: ${photo.user.name}</div>
		    <div class='twitter' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}">Twitter: ${photo.user.twitter_username !== null ? photo.user.twitter_username : 'Unknown'}</div>
		    <div class='location' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}">Location: ${photo.user.location !== null ? photo.user.location : 'Nowhere'}</div>
		    <div class='portfolio' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}"><a href="${photo.user.portfolio_url}" target='blank'>Portfolio Link</a></div>
		    <div class='link' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}"><a href="${photo.urls.full}" target='blank'>Photo Link</a></div>
		    <div class='total' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}">Total Photos: ${photo.user.total_photos}</div>
		    <div class='likes' style="color:#${col}; background:${col === '000000' ? '#ffffff': '#333333'}">Likes: ${photo.user.total_likes}</div>
		    <div class='photo_img' style=""> <img src='${photo.urls.regular}'> </div>
		    `;
		  
		    // APPEND
		    fragment.append(div)
		    container.append(fragment);
		});

		// Pagination
		paginationFn();

	}catch(err){
		console.log(err);
		alert(`${err.message}`);
	}
};
searchPhotos(searchText, page);

// COLOR FN FROM HEX TO RGB

function colorDark (hexcol){
	// Regex
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexcol);
	let r = parseInt(result[1], 16);
	let g = parseInt(result[2], 16);
	let b = parseInt(result[3], 16);
	let rgb = `rgb(${r},${g},${b})`;
	let rgbObj = {r,g,b};
	let myVal = checkDarkness(rgbObj, rgb);
	return myVal;
};

// CHECK COLOR DARKNESS
function checkDarkness (col, rgb){
	let val = (col.r * 0.2126 + col.g * 0.7152 + col.b * 0.0722) < 40;
	if(val){
		// console.log(`${rgb} is dark color`);
		return 'ffffff';
	}else{
		// console.log(`${rgb} is light color`);
		return '000000';
	}
};

// SEARCH FORM
searchform.addEventListener('submit', e =>{
	e.preventDefault();
	searchText = sanitize(searchInput.value);
	// console.log(sanitize(searchText));
	
	// PAGE RESET
	page = 1;

	// SEARCH
	searchPhotos(searchText, page);

	// CLEAN UP
	searchform.reset();
});

// SANITIZE INPUT
function sanitize (input){
	const div = document.createElement('div');
	div.textContent = input;
	return div.innerHTML;
};


// PAGINATION
function paginationFn (){
	// Create buttons
	let prevBtn = document.createElement('button');
	let nextBtn = document.createElement('button');
	// ADD INNER HTML
	prevBtn.innerHTML = `${page === 1 ? 'END' : `<img src="./imgs/back.svg" alt="back"> ${page - 1}`}`;
	if(page === 1){prevBtn.disabled = true}else{prevBtn.disabled = false};
	nextBtn.innerHTML = `${page === totalPages ?  'END' : `<img src="./imgs/forward.svg" alt="next"> ${page + 1}` }`;
	if(page === totalPages || totalPages === 0 ){nextBtn.disabled = true}else{nextBtn.disabled = false};

	// Add event Listener
	prevBtn.addEventListener('click', ()=>{
		// console.log('Prev');
		page = page > 1 ? page - 1: page;
		// Prev page
		searchPhotos(searchText, page);
		// console.log(page);
		// RESET BTNS VALUE
		prevBtn.innerHTML = `${page === 1 ? 'END' : `<img src="./imgs/back.svg" alt="back"> ${page - 1}`}`;
		if(page === 1){prevBtn.disabled = true}else{prevBtn.disabled = false};
		nextBtn.innerHTML = `${page === totalPages ?  'END' : `<img src="./imgs/forward.svg" alt="next"> ${page + 1}` }`;
		if(page === totalPages || totalPages === 0 ){nextBtn.disabled = true}else{nextBtn.disabled = false};
		// SCROLL ON TOP
		window.scrollTo({top: 0, behavior: 'smooth'});
		});

	nextBtn.addEventListener('click', ()=>{
		// console.log('Next');
		page = page < totalPages ? page = page + 1 : page;
		// Next Page
		searchPhotos(searchText, page);
		// console.log(page);
		// RESET BTNS VALUE
		prevBtn.innerHTML = `${page === 1 ? 'END' : `<img src="./imgs/back.svg" alt="back"> ${page - 1}`}`;
		if(page === 1){prevBtn.disabled = true}else{prevBtn.disabled = false};
		nextBtn.innerHTML = `${page === totalPages ?  'END' : `<img src="./imgs/forward.svg" alt="next"> ${page + 1}` }`;
		if(page === totalPages || totalPages === 0 ){nextBtn.disabled = true}else{nextBtn.disabled = false};
		// SCROLL ON TOP
		window.scrollTo({top: 0, behavior: 'smooth'});
	});

	// Append
	pagination.innerHTML = '';
	pagination.append(prevBtn, `Page: ${page} `, ` Total: ${totalPages}`, nextBtn);
}  
paginationFn();