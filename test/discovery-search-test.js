describe('discovery-search', () => {
	var component;

	it('loads element', () => {
		component = fixture('discovery-search-basic-fixture');
		expect(component).to.exist;
	});

	describe('accessibility', () => {
		it('should pass attest run', () => {
			if (isAttestInstalled()) {
				return runAttest();
			}
		});
	});
});
