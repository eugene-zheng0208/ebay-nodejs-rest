var assert = require('assert');
var request = require('supertest');



describe('Search by Category', function() {

	it('Should return 200 on /subcategory post and expect a paramater', function(done) {

		request('http://localhost:3004').get('/subcategory?subcategoryid=4').expect(200).end(
				function(err, res) {
					if (err)
						return done(err)
					done()
				})

	})
	
	
	
})




/*describe('add New Customer Page First Method', function() {

	it('should return 200 on /cutomers/add', function(done) {

		request('http://localhost:4300').post('/customers/add').end(
				function(err, res) {
					if (err)
						return done(err)
					else {
						expect(res).to.exist;
						expect(res.status).to.equal(200);
						expect(res.body).to.contain('name');
					}
					done()
				})

	})

})*/

/*describe('Adding New Customer', function() {
	it(function(done) {
		request.post('http://localhost:4300/customer/add').end(function(res) {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body).to.contain('name', 'address', 'email', 'phone');
			done();
		});
	});
})*/
