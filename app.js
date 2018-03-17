
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path'),
  person=require('./routes/person'),
  product=require('./routes/product'),
  index=require('./routes/index'),
  home=require('./routes/home'),
  subcategory=require('./routes/subcategory'),
  signin=require('./routes/signin'),
  signup = require('./routes/signup'),	
  header=require('./routes/header'),
  getCategory= require('./routes/getCategory'),
  payment=require('./routes/payment');
  	getSubCategory= require('./routes/getSubCategory'),
   addProduct= require('./routes/addProduct'),
   logout=require('./routes/logout'),
   seller=require('./routes/seller'),
  	cart=require('./routes/cart'),
  	history=require('./routes/history'),
    viewCart = require('./routes/viewCart'),
    listing=require('./routes/listing'),
    searchProduct=require('./routes/searchProduct'),
    getPendingPayments=require('./routes/getPendingPayments');
  	
    ;

  	var app = express();
  	app.use(express.cookieParser());
  	app.use(express.session({ secret: "topsecret" }));


var restify = require("restify");
var category=require('./routes/category');
// all environments
app.set('port', process.env.PORT || 3004);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(restify.bodyParser());
app.use(restify.CORS());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.home);
app.get('/users', user.list);
app.get('/searchCategory',category.search);
app.get('/listAllSubCategory',category.listAllSubCategory);
app.get('/test',index.redirect);
app.get('/deleteSubcategory',category.deleteSubcategory);
app.post('/updateSubcategoryDetails',category.updateSubcategoryDetails);
app.post('/addNewSubcategory',category.addNewSubcategory);
app.get('/getAllPersonData',person.getAllPersonData);
app.post('/updateUserStatus',person.updateUserStatus);
app.get('/getAllProductsData',product.getAllProductsData);
app.post('/updateProductStatus',product.updateProductStatus);
app.get('/home',function(req,res){res.render('home')});
app.get('/subcategory',subcategory.subcategory);
app.get('/SigninRedirect',signin.signinRedirect);
app.post('/SignIn', signin.signin);
app.get('/SignupRedirect',signup.signupRedirect);
app.get('/SigninRedirect',signin.signinRedirect);
app.post('/Signup',signup.signup);
app.get('/header',header.header);
app.get('/header2',header.header);
app.get('/GetCategories',getCategory.getCategory);
app.get('/GetCategoryPage',getCategory.getCategoryPage);
app.get('/GetSubCategories',getSubCategory.getSubCategory);
app.get('/AddProductContinue',addProduct.addProductContinue);
app.post('/UploadProductImage',addProduct.uploadProductImage);
app.get('/paymentRedirect',payment.paymentRedirect);
app.get('/logout',logout.logout);
app.get('/admin',routes.index);
app.get('/getAllSellerDataForAdmin',seller.getAllSellerDataForAdmin);
app.get('/getAllAuctionProducts',product.getAllAuctionProducts);
app.get('/addToCart',cart.addToCart);
app.get('/GetCart',viewCart.getCart);
app.get('/ViewCart',viewCart.viewCart);
app.get('/RemoveFromCart',viewCart.removeFromCart);
app.get('/getSoldProducts',history.getSoldProducts);
app.get('/getPurchasedProducts',history.getPurchasedProducts);
app.get('/history',history.redirect);
app.get('/GetProfilePage',signup.getProfilePage);
app.get('/GetProfile',signup.getProfileData);
app.post('/UpdateProfile',signup.updateProfile);
app.get('/GetUpdateProductPage',addProduct.getUpdateProductPage);
app.get('/GetProductDetails',addProduct.getProductDetails);
app.post('/UpdateProduct',addProduct.updateProduct);
app.get('/product', product.displayProductInfo);
app.get('/checkLoggedInUser', product.checkLoggedInUser);
app.get('/getLatestBid', product.getLatestBid);
app.post('/postBid', product.postBid);
app.get('/bidHistory', product.getBidHistory);
app.get('/refreshBids', product.refreshBids);
app.get('/userDetails',user.getUserInfo);
app.post('/postSellerReview',user.postSellerReview);
app.get('/refreshReviews' , user.refreshReviews);
app.get('/search',searchProduct.searchProducts);
app.get('/GetPendingPaymentsPage',getPendingPayments.getPendingPaymentsPage);
app.get('/getPendingPayment',getPendingPayments.getPendingItems);



app.get('/temp',function(req,res){
	res.render('temp');
	
});
app.get('/productListing',listing.listingRedirect);
app.get('/getProductListing',listing.getProductListing);
app.get('/payment',payment.showCheckout);

app.post('/makePayment',payment.makePayment);
app.get('/Checkemail',signup.checkemail);

http.createServer(app).listen(app.get('port'), function(req,res){
	
  console.log('Express server listening on port ' + app.get('port'));
  
  
});
