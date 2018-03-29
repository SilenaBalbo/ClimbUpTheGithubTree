
	let profilesFromFile = ramdomProfiles;
	let randNoArray = [];
	let urlsArray = [];
	let randProfArray = [];

	do {
		let randomNo = parseInt(Math.random() * 100);
		if (!(randNoArray.includes(randomNo))){
			randNoArray.push(randomNo);
		}
	} while (randNoArray.length !== 12);
	// console.log(randNoArray);

	randNoArray.forEach((no) => {
		let url = 'https://www.instagram.com/' + profilesFromFile[no] + '/?__a=1';
		// console.log(url);
		urlsArray.push(url);
	})
	console.log(urlsArray);
	
	let count = 0;
	urlsArray.forEach((url) => {
			$.getJSON(url, function(data){
		      let getProfile = data.graphql.user;
		      //test: show element
		      // console.log(getProfile);
		      console.log(getProfile.username);
		      randProfArray.push(getProfile);
		      count++;
		      if (count == 12){
		      	something(randProfArray);
		      }
  		})
	})

	// var mainData = [id3582115, id723531113, id261998995, id362405136,id34026859, id1735458172, id174618945, id44222792, id6281714, id6459664];

	function something (mainData){
		console.log(mainData);
		mainData.sort((a, b) => b.edge_followed_by.count - a.edge_followed_by.count);
		console.log(mainData);

		let vueElement = new Vue({
		el: '#app',
		data: {
			test: 'Hello People',
			mainArray: mainData,
			onePerson: mainData[0].edge_owner_to_timeline_media.edges,
			personsPosts: [],
			keyword: '',
			chartAvg: [],
			chartFollowedByAll: [],
			chartLikesInPosts: [],
			showPosts: false

		},
		created: function(){
			this.avgLikePerPost();
			this.noOfLikesPlus();
			this.createPersonsPostsArray();
		},
		methods: {
			createPersonsPostsArray: function(){
				// console.log('in createPersonsPostsArray: ');
				console.log(this.personsPosts.length);
				if (this.personsPosts.length > 0){
					this.personsPosts[0] = this.mainArray[0].edge_owner_to_timeline_media.edges;
				} else {
					for(let i = 0; i < this.mainArray.length; i ++){
						this.personsPosts.push(this.mainArray[i].edge_owner_to_timeline_media.edges);
					}
				}
				// console.log(this.personsPosts);
			},
			avgLikePerPost: function(){
				console.log('in avgLikePerPost');

				let likesPerPhotoAr = [];
				this.mainArray.forEach((profile) => { 
					let sum = 0;
					let counter = 0;
					for (let i = 0; i < profile.edge_owner_to_timeline_media.edges.length; i ++){
						sum += profile.edge_owner_to_timeline_media.edges[i].node.edge_liked_by.count;
						counter++;
					}
					likesPerPhotoAr.push(Math.round(sum/counter));
					profile.avgLikePerPost = Math.round(sum/counter);
				})
				console.log(likesPerPhotoAr);
				console.log(this.mainArray);

				// <pie-chart :data="[['Blueberry', 44], ['Strawberry', 23]]"></pie-chart>
				
				let newObjectChart = [];
				this.mainArray.forEach((profile) => {
					let tempArray = [];
					tempArray.push(profile.username);
					tempArray.push(profile.avgLikePerPost);
					newObjectChart.push(tempArray);
				});
				console.log('to chart no4: ');
				console.log(newObjectChart);
				this.chartAvg = newObjectChart;
			},
			noOfLikesPlus: function() {
				
				// chart no5
				let tempChartArray1 = [];
				this.mainArray.forEach((profile) => {
					let tempArray = [];
					tempArray.push(profile.username);
					tempArray.push(profile.edge_followed_by.count);
					tempChartArray1.push(tempArray);
				});
				console.log('to chart no5: ');
				console.log(tempChartArray1);
				this.chartFollowedByAll = tempChartArray1;

				// chart no6
				// data = [
				//   {name: 'Workout', data: {'2017-01-01 00:00:00 -0800': 3, '2017-01-02 00:00:00 -0800': 4}},
				//   {name: 'Call parents', data: {'2017-01-01 00:00:00 -0800': 5, '2017-01-02 00:00:00 -0800': 3}}
				// ];

				console.log('to chart no6: ');
				let tempChartArray2 = [];

				this.mainArray.forEach((profile, index) => {
					tempChartArray2.push({ 
						"name" : profile.username,
						"data" : {}
					});
					// console.log('tempChartArray2 test: ');
					// console.log(tempChartArray2);
					// console.log(tempChartArray2[0].data);
					let counter = 1;
					console.log(profile.edge_owner_to_timeline_media.edges.length);
					profile.edge_owner_to_timeline_media.edges.forEach((post) => {
						tempChartArray2[index].data[counter] = post.node.edge_liked_by.count;
						// tempChartArray2[index].data[post.node.edge_liked_by.count] = counter;
						counter++;
						// tempChartArray2[i].data.push(post.node.edge_liked_by.count);
					});
				});
				

				// this.mainArray.forEach((profile) => {
				// 	let tempArray = [];
				// 	tempArray.push(profile.username);
				// 	tempArray.push(profile.edge_followed_by.count);
				// 	tempChartArray2.push(tempArray);
				// });
				
				console.log(tempChartArray2);
				this.chartLikesInPosts = tempChartArray2;


			},
			//marszalek.kowalewska
			compareProfile: function(){
				console.log('in compareProfile');
				console.log(this.keyword);
				// console.log(this.mainArray[0]);
				let newUrl = 'https://www.instagram.com/' + this.keyword + '/?__a=1';
				$.getJSON(newUrl, function(myProfile){
					vueElement.mainArray[0] = myProfile.graphql.user;
					vueElement.avgLikePerPost();
					vueElement.noOfLikesPlus();
					vueElement.createPersonsPostsArray();
				})
			},
			showPostsElement: function(id){
				console.log('in showPostsElement');
				console.log(id);

				this.mainArray.forEach((profile) => {
					if(profile.id == id){
						this.onePerson = profile.edge_owner_to_timeline_media.edges;
					}
				})
				this.showPosts = true;
				console.log(this.onePerson);
			}	
		}
	})

	}
	



