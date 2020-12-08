export default {
	OK: "OK", // An action that will confirm the currently displayed option.
	accessMaterials: "資料へのアクセス", // Unused
	addToMyList: "マイリストに追加", // Unused
	addedToMyLearningHeader: "マイラーニングに正常に追加されました", // Unused
	addedToYourList: "リストに追加されました", // Unused
	all: "すべて", // The name of the homepage section for all activities.
	alreadyEnrolled: "すでに登録済み", // Displays when the user views the enrollment state for an activity they are already enrolled in.
	backToDiscover: "Discover に戻る", //This breadcrumb will return the user to the homepage.
	browseAllContent: "すべてのコンテンツの参照", // Action that opens the search page with all available activities displayed.
	close: "閉じる", // An action that will close the currently displayed option.
	continueBrowsing: "参照の続行", // Unused
	courseCode: "コースコード", // A subtitle for displaying the course code of a course
	courseDescription: "コースの説明", // Subtitle displayed on a course's summary page above the course description.
	courseInfo: "コース情報", // A subtitle for displaying an area of information about a course
	coursePageDocumentTitle: "{courseName} - Discover - {instanceName}", // Displays as the page/tab header for the course page.
	courseSummaryReadyMessage: "{courseTitle} の準備ができました", // When the course summary page has finished loading.
	discover: "Discover", //Title text for the homepage.
	discoverHomeMessage: "Discover のホームページです。", // Old message, unused.
	discovery: "検出", //Old title text, unused.
	durationMinutes: "{minutes} 分", // When viewing a course summary, this will display the duration of a course in minutes.
	emailFeedback: "{email} にフィードバックをメールする", // Unused
	endDate: "終了日", // A subtitle for displaying the date a course will end
	endDateIsInThePast: "このコースは {date} に終了しました。", // A message describing the date a course was closed on.
	enrollInCourse: "コースへの登録", // An action to enroll the user into the currently displayed course
	enrollmentHeaderFail: "登録できませんでした", // Displays as a header when there was an error enrolling into an activity
	enrollmentHeaderPending: "登録は承認待ちです", // Displays as a header when the enrollment is pending completion
	enrollmentHeaderSuccess: "登録が完了しました", // Displays as a header when the user has been successfully enrolled into an activity
	enrollmentHeaderUnenrolled: "現在、アクセス権がありません", // Displays as a header when the user was un-enrolled from an activity
	enrollmentMessageFail: "現時点では登録できません。後でもう一度試してください。", // Displays when there was an issue enrolling into an activity, and to try again later.
	enrollmentMessagePending: "このコースへの登録は承認待ちとなっています。このコースへのアクセスに関しては、のちほどご確認ください。", // Displays when the enrollment is pending completion, and tells the user to check back shortly.
	enrollmentMessageSuccess: "{title} はまもなくマイコースウィジェットに表示されます。", // Displays that the enrolled activity will be available via My Courses shortly.
	enrollmentMessageSuccessFuture: "{title} は {date} にマイコースウィジェットで使用可能です", // Displays that the enrolled activity will be available via My Courses on a certain date.
	enrollmentMessageSuccessPast: "{title} は {date} に終了しました", // Displays that the enrolled activity was available via My Courses, but ended on a certain date.
	enrollmentMessageUnenrolled: "管理者が登録解除しました。管理者に連絡して再登録を依頼してください。", // Displays when a user was un-enrolled by an activity by an administrator.
	enrollmentOptions: "登録オプション", // Subtitle for displaying the options a user has for enrollment in an activity
	firstPublished: "初回公開日", // A subtitle for displaying the original publishing date of a course
	homepageDocumentTitle: "Discover - {instanceName}", // Displays as the page/tab header for the homepage.
	lastUpdatedDate: "最終更新日 {date}", //The most recent date that the current course was updated
	loadMore: "さらに読み込む", // An action that will load additional activities to be displayed.
	message404: "404 エラーが発生しました。", // A 404 message that appears when the user navigates to a page that doesn't exist.
	navigateHome: "ホームに戻ります。", // An action that will navigate the user back to the Discover homepage.
	new: "新規", // The name of the homepage section for new activities.
	noActivities: "使用可能なアクティビティがないか、すべてのアクティビティにすでに登録済みです。後でもう一度試してください。", // When there are no activities to display on the homepage, this message will display.
	noActivitiesExceptPrmoted: "使用可能な追加のアクティビティがないか、すべてのアクティビティにすでに登録済みです。後でもう一度試してください。", // When only promoted activities are displayed on the homepage, this will display underneath.
	noContentAdded: "新規追加のコースはありません。", // Displays as a header when sorting by newly added while having no courses be new (within whatever the specified timeframe is).
	noContentEnrolled: "現在どのコースにも登録されていません。", // Displays as a header when sorting by enrolled while not having any courses enrolled.
	noContentMessage: "別の並べ替え方式を使用してください。", // Displays in a search result when no content is loaded and nothing was searched.
	noContentRelevant: "関連性が最も高い検索結果はありません。", // Displays as a header when sorting by relevant while there being no courses to enroll in that haven't already been enrolled in.
	noContentUpdated: "新規更新のコースはありません。", // Displays as a header when sorting by newly updated while having no courses be recently updated (within whatever the specified timeframe is).
	noCourseDescription: "コースの説明がありません", // Displays in a course's summary if it does not have a description.
	noResultsHeading: "「{searchQuery}」の検索結果はありません", // Displays as a header when a search query has no results
	noResultsMessage: "別の語句で検索するか、{linkStart}すべてを参照{linkEnd}して使用可能なすべての資料を表示してください", // When a search query has no results, suggests different search term or filter.
	onMyList: "マイリスト", // Unused
	openCourse: "コースを開く", // An action that will open the currently displayed course in brightspace.
	or: "または", //Unused
	pageAllLoadedMessage: "コースのページが読み込まれました。", // Unused
	pageSelection: "{pageTotal} ページ中 {pageCurrent} ページ目ページ番号を入力して、そのページに移動", // In a search's pagination component, shows the page number and how to navigate to a new page.
	pageSelectionInvalid: "値は 1～{pageTotal} のいずれかである必要があります", // Displays when entering an invalid number into a search's pagination component.
	pagePrevious: "前のページへ", // When hovering over the previous button on a search's pagination page, this will navigate to the previous page.
	pageNext: "次のページへ",  // When hovering over the next button on a search's pagination page, this will navigate to the next page.
	recentlyUpdatedAllLoadedMessage: "最近更新されたすべてのコースが読み込まれました", // Unused
	resultsFor: "\"{searchQuery}\" の結果 {amount} 件", // Unused.
	search: "検索", // When navigating discover, this will allow you to search for different activities.
	searchKeywords: "検索キーワード", // A subtitle for displaying a list of keywords associated with a course
	searchPageDocumentTitle: "検索: {searchTerm} - Discover - {instanceName}", // Displays as the page/tab header for the search page.
	searchPlaceholder: "検索...", // Placeholder text for search inputs.
	searchResultCount: "「{searchQuery}」の結果 {searchResultsTotal} 件中 {searchResultRange} 件", // When searching, displays the count of activities for the most recent search query.
	searchResultsOffscreen: "「{searchQuery}」の検索結果", // Displays the search results for a search query have finished loading.
	searchResultsReadyMessage: "「{searchQuery}」に対して {pageTotal} ページ中 {pageCurrent} ページ目の準備ができました", // Unused
	searchResultCountForAllResults: "{searchResultsTotal} 件中 {searchResultRange} 件の結果", // Displays a search's displayed number and maximum total of results.
	searchResultsReadyMessageForAllResults: "{pageTotal} ページ中 {pageCurrent} ページ目の準備ができました", // Unused
	settings: "設定", // An action that opens up Discover's Settings page.
	settingsLabel: "クリックして設定ページを表示", // The aria label describing the action that opens up Discover's Settings page.
	sorting_enrolled: "登録済み", // Search's sort option that displays results that the user is already enrolled in.
	sorting_mostRelevant: "関連性が最も高い", // Search's sort option that displays results ordered by most relevant to the search query
	sorting_new: "新規", // Search's sort option that displays results ordered by newest to the search query
	sorting_sortBy: "並べ替え基準", // The title of the sort filter in the search page
	sorting_updated: "更新済み", // Search's sort option that displays results ordered by most recently updated to the search query
	startDate: "開始日", // A subtitle for displaying the date a course will begin
	startDateIsInTheFuture: "このコースは {date} に公開されます。", // A message describing the date a course will become available is.
	startLearning: "学習の開始", // Unused
	unenroll: "登録解除",  // An action that will un-enroll the user from the displayed activity.
	unenrollConfirmBody: "「{title}」から正常に登録解除されました。", // A confirmation message that displays when a user has completed un-enrolling from an activity
	unenrollConfirmHeader: "登録解除完了", // A confirmation header that displays when a user has completed un-enrolling from an activity
	updated: "更新済み", // The name of the homepage section for recently updated activities.
	viewAll: "すべてを表示", // Action that opens the search page to view all activities within a certain category.
	viewAllLabel: "クリックしてすべてのアクティビティを表示", // Message that describes the view all action for all activities.
	viewAllNewLabel: "クリックして新規アクティビティを表示", // Message that describes the view all action for new activities.
	viewAllUpdatedLabel: "クリックして新しく更新されたアクティビティを表示", // Message that describes the view all action for newly updated activities.
	viewMyList: "マイリストの表示", // Unused
	welcomeToTheCourse: "コースへようこそ。", // Unused
};
