import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import SirenParse from 'siren-parser';

describe('course-summary', () => {
	const testActionEnroll = '{ "name": "assign", "href": "/enroll/in/course", "method": "POST", "type": "application/json"}';
	const testActionEnrollHrefRegex = /\/enroll\/in\/course$/;
	const testOrganizationHomepage = '/test/organization/homepage';
	const testOrganizationHref = '/test/organization/href';
	const testOrganizationHrefRegex = /\/test\/organization\/href$/;
	const testOrganizationHrefWithoutHomepage = '/test/organization/href/without/homepage';
	const testOrganizationHrefWithoutHomepageRegex = /\/test\/organization\/href\/without\/homepage$/;

	var component,
		fetchStub,
		sandbox;

	function setComponentForEnrollment({ component, enrolled }) {
		if (enrolled) {
			component.setAttribute('action-enroll', '');
			component.setAttribute('organization-homepage', testOrganizationHomepage);
			component.setAttribute('organization-href', testOrganizationHref);
		} else {
			component.setAttribute('action-enroll', testActionEnroll);
			component.setAttribute('organization-homepage', '');
			component.setAttribute('organization-href', testOrganizationHref);
		}
	}

	function setComponentHomepage({ component, homepage }) {
		if (homepage) {
			component.setAttribute('organization-homepage', '');
			component.setAttribute('organization-href', testOrganizationHref);
		} else {
			component.setAttribute('organization-homepage', '');
			component.setAttribute('organization-href', testOrganizationHrefWithoutHomepage);
		}
	}

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		fetchStub = sandbox.stub(window.d2lfetch, 'fetch');

		const organizationEntity = SirenParse({
			properties: {
			},
			class: [
			],
			links: [
				{
					rel: [
						'https://api.brightspace.com/rels/organization-homepage'
					],
					href: testOrganizationHomepage,
					type: 'text/html'
				}
			]
		});
		const organizationEntityWithoutHomepage = SirenParse({
			properties: {},
			class: [],
			links: []
		});
		fetchStub.withArgs(sinon.match.has('url', sinon.match(testOrganizationHrefRegex)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(organizationEntity); }
			}));
		fetchStub.withArgs(sinon.match.has('url', sinon.match(testOrganizationHrefWithoutHomepageRegex)))
			.returns(Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(organizationEntityWithoutHomepage); }
			}));
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('loads element', () => {
		component = fixture('course-summary-basic-fixture');
		expect(component).to.exist;
	});

	describe('property tests', ()=> {
		const testTitle = 'test course title';
		const testDescription = 'test description';
		const testDuration = 123412341234123412341234;
		const testLastUpdated = 'test last updated';
		const testFormat = 'test format';

		beforeEach(done => {
			component = fixture('course-summary-basic-fixture');
			component.setAttribute('course-title', testTitle);
			component.setAttribute('course-description', testDescription);
			component.setAttribute('course-duration', testDuration);
			component.setAttribute('course-last-updated', testLastUpdated);
			component.setAttribute('format', testFormat);
			component.setAttribute('data-is-ready', true);
			afterNextRender(component, () => {
				component.setAttribute('data-is-ready', true);
				afterNextRender(component, done);
			});
		});

		it('should show all properties', done => {
			const title = component.$$('.discovery-course-summary-title').innerHTML;
			expect(title).to.include(testTitle);

			const infoContainer = component.$$('.discovery-course-summary-info-container').innerHTML;
			expect(infoContainer).to.include(testDuration);
			expect(infoContainer).to.include(testLastUpdated);
			expect(infoContainer).to.include(testFormat);

			afterNextRender(component, () => {
				const description = component.$$('.discovery-course-summary-description').innerHTML;
				expect(description).to.include(testDescription);

				const emptyDescriptionBox = component.$$('.discovery-course-summary-empty-description');
				expect(emptyDescriptionBox.getAttribute('hidden')).to.not.equal(null);
				done();
			});
		});

		it('no description should show a message about no description', done => {
			component.setAttribute('course-description', '');

			afterNextRender(component, () => {
				const emptyDescriptionElement = component.$$('.discovery-course-summary-empty-description');
				expect(emptyDescriptionElement.getAttribute('hidden')).to.equal(null);
				expect(emptyDescriptionElement.innerHTML).to.include('No course description');

				const descriptionElement = component.$$('.discovery-course-summary-description');
				expect(descriptionElement.getAttribute('hidden')).to.not.equal(null);
				done();
			});
		});

		it('should pass attest run', () => {
			if (isAttestInstalled()) {
				return runAttest();
			}
		});
	});

	describe('user is enrolled', () => {
		before(done => {
			component = fixture('course-summary-basic-fixture');
			setComponentForEnrollment({ component, enrolled: true });
			afterNextRender(component, done);
		});

		it('open course button exists and is displayed', () => {
			const openCourseButton = component.$$('#discovery-course-summary-open-course');
			expect(openCourseButton).to.exist;
			expect(openCourseButton.style.display).to.not.equal('none');
		});

		it('enroll button does not exist', () => {
			const enrollButton = component.$$('#discovery-course-summary-enroll');
			expect(enrollButton).to.not.exist;
		});

		it('should navigate to organization homepage on click', done => {
			const openCourseButton = component.$$('#discovery-course-summary-open-course');
			component.addEventListener('navigate-parent', (e) => {
				expect(e.detail.path).to.equal(testOrganizationHomepage);
				done();
			});
			openCourseButton.click();
		});
	});

	describe('user is not enrolled', () => {
		beforeEach(done => {
			component = fixture('course-summary-basic-fixture');
			setComponentForEnrollment({ component, enrolled: false });
			afterNextRender(component, done);
		});

		it('open course button does not exist', () => {
			const openCourseButton = component.$$('#discovery-course-summary-open-course');
			expect(openCourseButton).to.not.exist;
		});

		it('enroll button does exist and is displayed', () => {
			const enrollButton = component.$$('#discovery-course-summary-enroll');
			expect(enrollButton).to.exist;
			expect(enrollButton.style.display).to.not.equal('none');
		});

		it('enrolling workflow succeeding', done => {
			// Workflow finishes after the user is enrolled and navigates to the homepage
			component.addEventListener('navigate-parent', (e) => {
				expect(e.detail.path).to.equal(testOrganizationHomepage);
				done();
			});

			// Success enrollment stub
			fetchStub.withArgs(sinon.match.has('url', sinon.match(testActionEnrollHrefRegex)))
				.returns(Promise.resolve({
					ok: true,
					json: () => {
						return Promise.resolve({});
					}
				}));

			const enrollButton = component.$$('#discovery-course-summary-enroll');
			expect(enrollButton).to.exist;
			expect(enrollButton.style.display).to.not.equal('none');
			enrollButton.click();

			afterNextRender(component, () => {
				// Dialog is opened with success message
				const dialog = component.$$('#discovery-course-summary-enroll-dialog');
				expect(dialog.opened).to.equal(true);
				const dialogMessage = component.$$('.discovery-course-summary-dialog-content-container').innerHTML;
				expect(dialogMessage).to.include('will soon be available in the My Courses widget.');

				// Open Course button does exist and is displayed
				const openCourseButton = component.$$('#discovery-course-summary-open-course');
				expect(openCourseButton).to.exist;
				expect(openCourseButton.style.display).to.not.equal('none');

				// Enroll button is hidden
				expect(enrollButton.style.display).to.equal('none');

				// Click the open course button
				openCourseButton.click();
			});
		});

		it('enrolling workflow failing', done => {
			// Fail enrollment stub
			fetchStub.withArgs(sinon.match.has('url', sinon.match(testActionEnrollHrefRegex)))
				.returns(Promise.resolve({
					ok: true,
					json: () => {
						return Promise.reject({});
					}
				}));

			const enrollButton = component.$$('#discovery-course-summary-enroll');
			expect(enrollButton).to.exist;
			expect(enrollButton.style.display).to.not.equal('none');
			enrollButton.click();

			afterNextRender(component, () => {
				// Dialog is opened with error message
				const dialog = component.$$('#discovery-course-summary-enroll-dialog');
				expect(dialog.opened).to.equal(true);
				const dialogMessage = component.$$('.discovery-course-summary-dialog-content-container').innerHTML;
				expect(dialogMessage).to.include('Unable to enroll at this time, please try again later.');

				// Open Course button does not exist
				const openButton = component.$$('#discovery-course-summary-open-course');
				expect(openButton).to.not.exist;

				// Enroll button still exists and is displayed
				expect(enrollButton).to.exist;
				expect(enrollButton.style.display).to.not.equal('none');
				done();
			});
		});
	});

	describe('enrollment is pending', () => {
		before(done => {
			component = fixture('course-summary-basic-fixture');
			setComponentForEnrollment({ component, enrolled: false });
			setComponentHomepage({ component, homepage: false });
			afterNextRender(component, done);
		});
		it('enrollment workflow encounters pending dialog before enrollment is successful', done => {
			// Workflow finishes after the user is enrolled and navigates to the homepage
			component.addEventListener('navigate-parent', (e) => {
				expect(e.detail.path).to.equal(testOrganizationHomepage);
				done();
			});

			// Success enrollment stub
			fetchStub.withArgs(sinon.match.has('url', sinon.match(testActionEnrollHrefRegex)))
				.returns(Promise.resolve({
					ok: true,
					json: () => {
						return Promise.resolve({});
					}
				}));

			const enrollButton = component.$$('#discovery-course-summary-enroll');
			expect(enrollButton).to.exist;
			expect(enrollButton.style.display).to.not.equal('none');
			enrollButton.click();

			afterNextRender(component, () => {
				// Dialog is opened with success message
				const dialog = component.$$('#discovery-course-summary-enroll-dialog');
				expect(dialog.opened).to.equal(true);
				const dialogMessage = component.$$('.discovery-course-summary-dialog-content-container').innerHTML;
				expect(dialogMessage).to.include('will soon be available in the My Courses widget.');

				// Open Course button does exist and is displayed
				const openCourseButton = component.$$('#discovery-course-summary-open-course');
				expect(openCourseButton).to.exist;
				expect(openCourseButton.style.display).to.not.equal('none');

				// Enroll button is hidden
				expect(enrollButton.style.display).to.equal('none');

				// Click the open course button
				openCourseButton.click();

				// Pending dialog is shown
				afterNextRender(component, () => {
					const dialog = component.$$('#discovery-course-summary-enroll-dialog');
					expect(dialog.opened).to.equal(true);
					const dialogMessage = component.$$('.discovery-course-summary-dialog-content-container').innerHTML;
					expect(dialogMessage).to.include('Your enrollment to this course is still pending.');

					// Open Course button still exists and is displayed
					const openCourseButton = component.$$('#discovery-course-summary-open-course');
					expect(openCourseButton).to.exist;
					expect(openCourseButton.style.display).to.not.equal('none');

					// Set organization-href to something that will now return a homepage
					component.setAttribute('organization-href', testOrganizationHref);
					afterNextRender(component, () => {
						openCourseButton.click();
					});
				});
			});
		});
	});

	describe('start date and end date alerts', () => {
		const futureIsoDateTime = moment().add(1, 'minutes').toISOString();
		const pastIsoDateTime = moment().subtract(1, 'minutes').toISOString();

		before(done => {
			component = fixture('course-summary-basic-fixture');
			setComponentForEnrollment({ component, enrolled: false }); // make sure the user is not enrolled
			afterNextRender(component, done);
		});

		describe('start date is in the past and end date is in the future', () => {
			before(done => {
				component.setAttribute('start-date', 'testStartDate');
				component.setAttribute('start-date-iso-format', pastIsoDateTime);
				component.setAttribute('end-date', 'testEndDate');
				component.setAttribute('end-date-iso-format', futureIsoDateTime);
				afterNextRender(component, done);
			});

			it('should not have alert ', () => {
				const startDateAlertElement = component.$$('#discovery-course-summary-start-date-alert');
				const endDateAlertElement = component.$$('#discovery-course-summary-end-date-alert');
				expect(startDateAlertElement.getAttribute('hidden')).to.not.equal(null);
				expect(endDateAlertElement.getAttribute('hidden')).to.not.equal(null);
			});

			it('enrollment button is enabled if not enrolled', () => {
				const enrollButton = component.$$('#discovery-course-summary-enroll');
				expect(enrollButton.getAttribute('disabled')).to.equal(null);
			});
		});

		describe('start date is in the future', () => {
			before(done => {
				component.setAttribute('start-date', 'testStartDate');
				component.setAttribute('start-date-iso-format', futureIsoDateTime);
				component.setAttribute('end-date', 'testEndDate');
				component.setAttribute('end-date-iso-format', futureIsoDateTime);
				afterNextRender(component, done);
			});

			it('should have alert', () => {
				const startDateAlertElement = component.$$('#discovery-course-summary-start-date-alert');
				const endDateAlertElement = component.$$('#discovery-course-summary-end-date-alert');
				expect(startDateAlertElement.getAttribute('hidden')).to.equal(null);
				expect(endDateAlertElement.getAttribute('hidden')).to.not.equal(null);
			});

			it('enrollment button is enabled if not enrolled', () => {
				const enrollButton = component.$$('#discovery-course-summary-enroll');
				expect(enrollButton.getAttribute('disabled')).to.equal(null);
			});
		});

		describe('end date is in the past', () => {
			before(done => {
				component.setAttribute('start-date', 'testStartDate');
				component.setAttribute('start-date-iso-format', pastIsoDateTime);
				component.setAttribute('end-date', 'testEndDate');
				component.setAttribute('end-date-iso-format', pastIsoDateTime);
				afterNextRender(component, done);
			});

			it('should have alert', () => {
				const startDateAlertElement = component.$$('#discovery-course-summary-start-date-alert');
				const endDateAlertElement = component.$$('#discovery-course-summary-end-date-alert');
				expect(startDateAlertElement.getAttribute('hidden')).to.not.equal(null);
				expect(endDateAlertElement.getAttribute('hidden')).to.equal(null);
			});

			it('enrollment button is disabled if not enrolled', () => {
				const enrollButton = component.$$('#discovery-course-summary-enroll');
				expect(enrollButton.getAttribute('disabled')).to.not.equal(null);
			});
		});
	});
});
