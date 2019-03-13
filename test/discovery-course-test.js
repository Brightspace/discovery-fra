describe('discovery-course', () => {
	var component;

	it('loads element', () => {
		component = fixture('discovery-course-basic-fixture');
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
