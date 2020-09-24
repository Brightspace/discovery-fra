export default {
	OK: "確定", // An action that will confirm the currently displayed option.
	accessMaterials: "存取資料", // Unused
	addToMyList: "新增至我的清單", // Unused
	addedToMyLearningHeader: "已成功新增至「我的學習」", // Unused
	addedToYourList: "已新增至您的清單", // Unused
	all: "全部", // The name of the homepage section for all activities.
	alreadyEnrolled: "已註冊", // Displays when the user views the enrollment state for an activity they are already enrolled in.
	backToDiscover: "返回探索", //This breadcrumb will return the user to the homepage.
	browseAllContent: "瀏覽所有內容", // Action that opens the search page with all available activities displayed.
	close: "關閉", // An action that will close the currently displayed option.
	continueBrowsing: "繼續瀏覽", // Unused
	courseCode: "課程代碼", // A subtitle for displaying the course code of a course
	courseDescription: "課程說明", // Subtitle displayed on a course's summary page above the course description.
	courseInfo: "課程資訊", // A subtitle for displaying an area of information about a course
	coursePageDocumentTitle: "{courseName} - 探索 - {instanceName}", // Displays as the page/tab header for the course page.
	courseSummaryReadyMessage: "{courseTitle} 已就緒", // When the course summary page has finished loading.
	discover: "探索", //Title text for the homepage.
	discoverHomeMessage: "這是探索首頁。", // Old message, unused.
	discovery: "探索", //Old title text, unused.
	durationMinutes: "{minutes} 分鐘", // When viewing a course summary, this will display the duration of a course in minutes.
	emailFeedback: "透過電子郵件將您的意見反應傳送至 {email}", // Unused
	endDate: "結束日期", // A subtitle for displaying the date a course will end
	endDateIsInThePast: "此課程已於 {date} 關閉。", // A message describing the date a course was closed on.
	enrollInCourse: "註冊課程", // An action to enroll the user into the currently displayed course
	enrollmentHeaderFail: "無法註冊", // Displays as a header when there was an error enrolling into an activity
	enrollmentHeaderPending: "註冊擱置中", // Displays as a header when the enrollment is pending completion
	enrollmentHeaderSuccess: "已成功註冊", // Displays as a header when the user has been successfully enrolled into an activity
	enrollmentHeaderUnenrolled: "目前無存取", // Displays as a header when the user was un-enrolled from an activity
	enrollmentMessageFail: "目前無法註冊，請稍後再試一次。", // Displays when there was an issue enrolling into an activity, and to try again later.
	enrollmentMessagePending: "您對於此課程的註冊仍在擱置中，請稍後再回來查看以存取此課程。", // Displays when the enrollment is pending completion, and tells the user to check back shortly.
	enrollmentMessageSuccess: "{title} 很快就會在「我的課程」Widget 中提供使用。", // Displays that the enrolled activity will be available via My Courses shortly.
	enrollmentMessageSuccessFuture: "{title} 將於 {date} 在「我的課程」Widget 中提供使用", // Displays that the enrolled activity will be available via My Courses on a certain date.
	enrollmentMessageSuccessPast: "{title} 已於 {date} 結束", // Displays that the enrolled activity was available via My Courses, but ended on a certain date.
	enrollmentMessageUnenrolled: "管理員已取消您的註冊，請與您的管理員聯繫以再次註冊。", // Displays when a user was un-enrolled by an activity by an administrator.
	enrollmentOptions: "註冊選項", // Subtitle for displaying the options a user has for enrollment in an activity
	firstPublished: "首次發佈", // A subtitle for displaying the original publishing date of a course
	homepageDocumentTitle: "探索 - {instanceName}", // Displays as the page/tab header for the homepage.
	lastUpdatedDate: "上次更新時間：{date}", //The most recent date that the current course was updated
	loadMore: "載入更多", // An action that will load additional activities to be displayed.
	message404: " 糟糕，發生 404 錯誤。", // A 404 message that appears when the user navigates to a page that doesn't exist.
	navigateHome: "返回首頁。", // An action that will navigate the user back to the Discover homepage.
	new: "新式", // The name of the homepage section for new activities.
	noActivities: "沒有可用的活動或您已經註冊所有的活動。請稍後再試。", // When there are no activities to display on the homepage, this message will display.
	noActivitiesExceptPrmoted: "沒有全新或更新的活動可用，或您已經註冊所有的活動。請稍後再試。", // When only promoted activities are displayed on the homepage, this will display underneath.
	noCourseDescription: "沒有課程說明", // Displays in a course's summary if it does not have a description.
	noResultsHeading: "沒有任何結果符合「{searchQuery}」", // Displays as a header when a search query has no results
	noResultsMessage: "請嘗試使用不同的搜尋詞彙，或是{linkStart}瀏覽全部{linkEnd}以檢視所有可用的資料", // When a search query has no results, suggests different search term or filter.
	onMyList: "在我的清單上", // Unused
	openCourse: "開啟課程", // An action that will open the currently displayed course in brightspace.
	or: "或", //Unused
	pageAllLoadedMessage: "課程頁面已載入。", // Unused
	pageSelection: "在第 {pageCurrent} 頁，共 {pageTotal} 頁。請輸入頁面號碼以前往該頁面", // In a search's pagination component, shows the page number and how to navigate to a new page.
	pageSelectionInvalid: "值必須介於 1 與 {pageTotal} 之間", // Displays when entering an invalid number into a search's pagination component.
	pagePrevious: "前往上一頁", // When hovering over the previous button on a search's pagination page, this will navigate to the previous page.
	pageNext: "前往下一頁",  // When hovering over the next button on a search's pagination page, this will navigate to the next page.
	recentlyUpdatedAllLoadedMessage: "最近更新的所有課程皆已載入", // Unused
	resultsFor: "{amount} 個結果符合「{searchQuery}」", // Unused.
	search: "搜尋", // When navigating discover, this will allow you to search for different activities.
	searchKeywords: "搜尋關鍵字", // A subtitle for displaying a list of keywords associated with a course
	searchPageDocumentTitle: "搜尋：{searchTerm} - 探索 - {instanceName}", // Displays as the page/tab header for the search page.
	searchPlaceholder: "搜尋...", // Placeholder text for search inputs.
	searchResultCount: "符合「{searchQuery}」的結果：{searchResultRange}/{searchResultsTotal}", // When searching, displays the count of activities for the most recent search query.
	searchResultsOffscreen: "「{searchQuery}」的搜尋結果", // Displays the search results for a search query have finished loading.
	searchResultsReadyMessage: "針對「{searchQuery}」，現在有 {pageCurrent} 個頁面已就緒 (共有 {pageTotal} 個頁面)", // Unused
	searchResultCountForAllResults: "{searchResultRange}/{searchResultsTotal} 個結果", // Displays a search's displayed number and maximum total of results.
	searchResultsReadyMessageForAllResults: "{pageCurrent}/{pageTotal} 頁已就緒", // Unused
	settings: "設定", // An action that opens up Discover's Settings page.
	settingsLabel: "按一下以檢視設定頁面", // The aria label describing the action that opens up Discover's Settings page.
	sorting_enrolled: "已註冊", // Search's sort option that displays results that the user is already enrolled in.
	sorting_mostRelevant: "最相關", // Search's sort option that displays results ordered by most relevant to the search query
	sorting_new: "新式", // Search's sort option that displays results ordered by newest to the search query
	sorting_sortBy: "排序方式", // The title of the sort filter in the search page
	sorting_updated: "已更新", // Search's sort option that displays results ordered by most recently updated to the search query
	startDate: "開始日期", // A subtitle for displaying the date a course will begin
	startDateIsInTheFuture: "此課程將於 {date} 提供。", // A message describing the date a course will become available is.
	startLearning: "開始學習", // Unused
	unenroll: "取消註冊",  // An action that will un-enroll the user from the displayed activity.
	unenrollConfirmBody: "您已成功從「{title}」取消註冊。", // A confirmation message that displays when a user has completed un-enrolling from an activity
	unenrollConfirmHeader: "取消註冊完成", // A confirmation header that displays when a user has completed un-enrolling from an activity
	updated: "已更新", // The name of the homepage section for recently updated activities.
	viewAll: "全部檢視", // Action that opens the search page to view all activities within a certain category.
	viewAllLabel: "按一下以檢視全部活動", // Message that describes the view all action for all activities.
	viewAllNewLabel: "按一下以檢視新活動", // Message that describes the view all action for new activities.
	viewAllUpdatedLabel: "按一下以檢視最近已更新的活動", // Message that describes the view all action for newly updated activities.
	viewMyList: "檢視我的清單", // Unused
	welcomeToTheCourse: "歡迎參加本課程！", // Unused
};
