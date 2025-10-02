function saveUser(user){

localStorage.setItem('bnsp_user', JSON.stringify(user));
}
function loadUser(){
const raw = localStorage.getItem('bnsp_user');
return raw ? JSON.parse(raw) : null;
}

function logoutAndRedirect(){
	localStorage.removeItem('bnsp_authenticated');
	location.href = 'index_en.html';
}

$(function(){

if(!loadUser()){
saveUser({name:'Demo User', email:'demo@bnsp.ph', password:'Demo12345'});
}

$('#registerFormPage').each(function(){
	if(!$(this).length) return;
	$(this).validate({
		rules: {
			regName: { required:true, minlength:3 },
			regEmail: { required:true, email:true },
			regPassword: { required:true, minlength:8 },
			regConfirmPassword: { required:true, equalTo: '#regPassword' },
			termsCheck: { required:true }
		},
		messages: {
			regPassword: { minlength: 'Password must be at least 8 characters' },
			regConfirmPassword: { equalTo: 'Passwords do not match' }
		},
		submitHandler: function(form){
			const name = $(form).find('[name="regName"]').val();
			const email = $(form).find('[name="regEmail"]').val();
			const password = $(form).find('[name="regPassword"]').val();
			saveUser({name, email, password});
		
			localStorage.setItem('bnsp_authenticated', email);
			location.href = 'dashboard_en.html';
		}
	});
});

$('#loginFormPage').each(function(){
	if(!$(this).length) return;
	$(this).validate({
		rules:{
			loginEmail:{ required:true, email:true },
			loginPassword:{ required:true }
		},
		submitHandler: function(form){
			const email = $(form).find('[name="loginEmail"]').val();
			const password = $(form).find('[name="loginPassword"]').val();
			const user = loadUser();
			if(user && user.email.toLowerCase() === email.toLowerCase() && user.password === password){
				localStorage.setItem('bnsp_authenticated', email);
				location.href = 'dashboard_en.html';
			} else {
				alert('Invalid credentials. Please try again.');
			}
		}
	});
});

if($('#dashWelcome').length){
	const user = loadUser();
	const auth = localStorage.getItem('bnsp_authenticated');
	if(!auth){

		location.href = 'login_en.html';
		return;
	}

	$('#dashWelcome').text((user && user.name) ? ('Welcome, ' + user.name) : auth);

	const sample = [
		{title:'Xiaomi Redmi 9', price:'₱5,500', img:'.vscode/xiaomi-redmi-9.jpg', desc:'Good condition, 64GB.'},
		{title:'Honda Wave 110', price:'₱28,000', img:'.vscode/wave110.png', desc:'Well-maintained, recent tune-up.'},
		{title:'Dining Set 4pcs', price:'₱7,800', img:'.vscode/dining.jpg', desc:'Solid wood, light wear.'}
	];
	const container = $('#myListings');
	sample.forEach(s => {
		const col = $('<div class="col-md-4"></div>');
		const card = $(`<div class="card card-deco h-100 shadow-sm"><img src="${s.img}" class="card-img-top"><div class="card-body"><h5 class="card-title">${s.title}</h5><p class="card-text">${s.desc}</p><div class="d-flex justify-content-between align-items-center"><span class="price">${s.price}</span><button class="btn btn-sm btn-outline-primary">Contact</button></div></div></div>`);
		col.append(card);
		container.append(col);
	});


	$('#logoutBtn').click(function(){
		const lang = location.pathname.includes('_fil') || location.pathname.includes('/tl') ? 'fil' : 'en';
		logoutAndRedirect(lang);
	});
}

});
