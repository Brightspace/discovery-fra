export default {
	discover: "Discover", //Title text for the homepage.
	discoverHomeMessage: "This is the Discover home page.", // Old message, unused.
	discovery: "Discovery", //Old title text, unused.
	courseDescription: "Course Description", // Subtitle displayed on a course's summary page above the course description.
	search: "Search", // When navigating discover, this will allow you to search for different activities.
	searchPlaceholder: "Search...", // Placeholder text for search inputs.
	resultsFor: "{amount} results for \"{searchQuery}\"", // Unused.
	searchResultCount: "{searchResultRange} of {searchResultsTotal} for \"{searchQuery}\"", // When searching, displays the count of activities for the most recent search query.
	pageSelection: "On page {pageCurrent} of {pageTotal}. Enter a page number to go to that page", // In a search's pagination component, shows the page number and how to navigate to a new page.
	pageSelectionInvalid: "Value must be between 1 and {pageTotal}", // Displays when entering an invalid number into a search's pagination component.
	pagePrevious: "To previous page", // When hovering over the previous button on a search's pagination page, this will navigate to the previous page.
	pageNext: "To next page",  // When hovering over the next button on a search's pagination page, this will navigate to the next page.
	backToDiscover: "Back to Discover", //This breadcrumb will return the user to the homepage.
	durationMinutes: "{minutes} minutes", // When viewing a course summary, this will display the duration of a course in minutes.
	lastUpdatedDate: "Last Updated {date}", //The most recent date that the current course was updated
	courseInfo: "Course Info", // A subtitle for displaying an area of information about a course
	startDate: "Start Date", // A subtitle for displaying the date a course will begin
	endDate: "End Date", // A subtitle for displaying the date a course will end
	courseCode: "Course Code", // A subtitle for displaying the course code of a course
	firstPublished: "First Published", // A subtitle for displaying the original publishing date of a course
	searchKeywords: "Search Keywords", // A subtitle for displaying a list of keywords associated with a course
	addToMyList: "Add to my List", // Unused
	enrollInCourse: "Enroll in Course", // An action to enroll the user into the currently displayed course
	accessMaterials: "Access Materials", // Unused
	onMyList: "On My List", // Unused
	addedToYourList: "Added to your list", // Unused
	viewMyList: "View my list", // Unused
	addedToMyLearningHeader: "Successfully Added to My Learning", // Unused
	enrollmentHeaderSuccess: "Successfully Enrolled", // Displays as a header when the user has been successfully enrolled into an activity
	enrollmentHeaderFail: "Failed to Enroll", // Displays as a header when there was an error enrolling into an activity
	enrollmentHeaderPending: "Enrollment is Pending", // Displays as a header when the enrollment is pending completion
	enrollmentMessageSuccess: "{title} will soon be available in the My Courses widget.", // Displays that the enrolled activity will be available via My Courses shortly.
	enrollmentMessageSuccessFuture: "{title} will become available in the My Courses widget on {date}", // Displays that the enrolled activity will be available via My Courses on a certain date.
	enrollmentMessageSuccessPast: "{title} ended on {date}", // Displays that the enrolled activity was available via My Courses, but ended on a certain date.
	enrollmentMessageFail: "Unable to enroll at this time, please try again later.", // Displays when there was an issue enrolling into an activity, and to try again later.
	enrollmentMessagePending: "Your enrollment to this course is pending, check back soon to access this course.", // Displays when the enrollment is pending completion, and tells the user to check back shortly.
	enrollmentHeaderUnenrolled: "No Current Access", // Displays as a header when the user was un-enrolled from an activity
	enrollmentMessageUnenrolled: "You have been un-enrolled by an Administrator, contact your Administrator in order to enroll again.", // Displays when a user was un-enrolled by an activity by an administrator.
	enrollmentOptions: "Enrollment Options", // Subtitle for displaying the options a user has for enrollment in an activity
	unenrollConfirmHeader: "Unenrollment Complete", // A confirmation header that displays when a user has completed un-enrolling from an activity
	unenrollConfirmBody: "You've been successfully unenrolled from \"{title}\".", // A confirmation message that displays when a user has completed un-enrolling from an activity
	OK: "OK", // An action that will confirm the currently displayed option.
	close: "Close", // An action that will close the currently displayed option.
	welcomeToTheCourse: "Welcome to the Course!", // Unused
	startLearning: "Start Learning", // Unused
	continueBrowsing: "Continue Browsing", // Unused
	unenroll: "Unenroll",  // An action that will un-enroll the user from the displayed activity.
	openCourse: "Open Course", // An action that will open the currently displayed course in brightspace.
	navigateHome: "Head back to home.", // An action that will navigate the user back to the Discover homepage.
	message404: " Oops you hit a 404.", // A 404 message that appears when the user navigates to a page that doesn't exist.
	startDateIsInTheFuture: "This course will become available on {date}.", // A message describing the date a course will become available is.
	endDateIsInThePast: "This course closed on {date}.", // A message describing the date a course was closed on.
	emailFeedback: "Email your feedback to {email}", // Unused
	noCourseDescription: "No course description", // Displays in a course's summary if it does not have a description.
	searchResultsOffscreen: "Search Results for \"{searchQuery}\"", // Displays the search results for a search query have finished loading.
	searchResultsReadyMessage: "Page {pageCurrent} of {pageTotal} for \"{searchQuery}\" is now ready", // Unused
	noResultsHeading: "No results for \"{searchQuery}\"", // Displays as a header when a search query has no results
	noResultsMessage: "Try using a different search term or {linkStart}Browse All{linkEnd} to view all available materials", // When a search query has no results, suggests different search term or filter.
	searchResultCountForAllResults: "{searchResultRange} of {searchResultsTotal} results", // Displays a search's displayed number and maximum total of results.
	searchResultsReadyMessageForAllResults: "Page {pageCurrent} of {pageTotal} is now ready", // Unused
	or: "or", //Unused
	browseAllContent: "Browse All Content", // Action that opens the search page with all available activities displayed.
	viewAll: "View All", // Action that opens the search page to view all activities within a certain category.
	viewAllNewLabel: "Click to view new activities", // Message that describes the view all action for new activities.
	viewAllUpdatedLabel: "Click to view newly updated activities", // Message that describes the view all action for newly updated activities.
	viewAllLabel: "Click to view all activities", // Message that describes the view all action for all activities.
	homepageDocumentTitle: "Discover - {instanceName}", // Displays as the page/tab header for the homepage.
	searchPageDocumentTitle: "Search: {searchTerm} - Discover - {instanceName}", // Displays as the page/tab header for the search page.
	coursePageDocumentTitle: "{courseName} - Discover - {instanceName}", // Displays as the page/tab header for the course page.
	updated: "Updated", // The name of the homepage section for recently updated activities.
	new: "New", // The name of the homepage section for new activities.
	all: "All", // The name of the homepage section for all activities.
	noActivities: "There are no activities available or you're already enrolled in all of them. Try again later.", // When there are no activities to display on the homepage, this message will display.
	noActivitiesExceptPrmoted: "There are no new or updated activities available or you're already enrolled in all of them. Try again later.", // When only promoted activities are displayed on the homepage, this will display underneath.
	recentlyUpdatedAllLoadedMessage: "All recently updated courses have been loaded", // Unused
	pageAllLoadedMessage: "The page of courses has been loaded.", // Unused
	loadMore: "Load More", // An action that will load additional activities to be displayed.
	alreadyEnrolled: "Already enrolled", // Displays when the user views the enrollment state for an activity they are already enrolled in.
	courseSummaryReadyMessage: "{courseTitle} is now ready", // When the course summary page has finished loading.
	sorting_sortBy: "Sort by", // The title of the sort filter in the search page
	sorting_mostRelevant: "Most Relevant", // Search's sort option that displays results ordered by most relevant to the search query
	sorting_updated: "Updated", // Search's sort option that displays results ordered by most recently updated to the search query
	sorting_new: "New", // Search's sort option that displays results ordered by newest to the search query
	sorting_enrolled: "Already Enrolled", // Search's sort option that displays results that the user is already enrolled in.
	settings: "Settings", // An action that opens up Discover's Settings page.
	settingsLabel: "Click to view settings page" // The aria label describing the action that opens up Discover's Settings page.
};
