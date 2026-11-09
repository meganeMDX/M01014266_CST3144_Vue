import {teachers, lessons, users, orders, ratings} from './data.js';
const baseURL = "http://localhost:3000";

const numberRegx = /\d/;
const upperCaseRegex = /(?=.*[A-Z])/;
const onlyLettersRegex = /^[A-Za-z ]+$/;
const onlyNumbersRegex = /^\d+$/;

const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:{},
            currentPage:'browsing',

            lessons:[],
            teachers: [],
            orders: [],
            expandedOrders:[],

            searchedText: "",
            debouncedSearch:null,
            searchResults:[],
            isSearching:true,

            selectedTeacherId: "",
            selectedAttribute:"topic",
            selectedOrder:"asc",
            selectedLessonType: "all",

            showPopup: false,
            selectedLesson: null,
            showLoginForm:false,
            showRegistrationForm:false,
            ratedItem: null,
            selectedRating: 0,


            loginEmail: "",
            loginPassword:"",
            registerName: "",
            registerEmail: "",
            registerPassword: "",
            currentUser:null,
            userRatings: [],
            authenticationError:"",

            passwordFocused: false,

            messageText: "",
            showMessagePopup : false,

            checkout_full_name: "",
            checkout_phone_number: "",

            itemToDelete: null,

            checkoutComplete:false,
            selectedHistoryOrder: "desc",
            baseURL:baseURL,

            showLogOutDropDown:false
        }
    },
    async created(){
        await this.fetchLessons();
        await this.fetchTeachers();

        this.debouncedSearch = this.debounce(this.searchLessons, 500);
    },
    methods:{
        navigateTo(pageName){
            if (this.currentPage === 'cart'){
                this.clearCheckoutForm();
            };

            if (this.currentPage === 'browsing'){
                this.clearFilters();
            }

            if (this.currentPage === 'history'){
                // collapse order details when leaving history page
                this.expandedOrders = [];
            }

            this.currentPage = pageName;
            window.scrollTo(0,0);
        },
        getTeacherName(teacherId){
            let teacher = this.teachers.find(teacher => teacher._id === teacherId);
            if (teacher === undefined){
                return '-'
            }
            return `${teacher.title}. ${teacher.firstName} ${teacher.lastName}`;
        },
        sortItems(items){
            if (this.selectedOrder === "asc"){
                // for numbers
                if (this.selectedAttribute === "price" || this.selectedAttribute === "space" ){
                    return items.sort((a, b) => a[this.selectedAttribute] - b[this.selectedAttribute]);
                }
                // for strings
                return items.sort((a, b) => a[this.selectedAttribute].toLowerCase().localeCompare(b[this.selectedAttribute].toLowerCase()));
            }

            // descending order
            if (this.selectedAttribute === "price" || this.selectedAttribute === "space" ){
                return items.sort((a, b) => b[this.selectedAttribute] - a[this.selectedAttribute]);
            }
            return items.sort((a, b) => b[this.selectedAttribute].toLowerCase().localeCompare(a[this.selectedAttribute].toLowerCase()));
        },
        setSelectedItemType(itemType){
            this.selectedLessonType = itemType;
        },
        clearFilters(){
            this.searchedText = "";
            this.selectedLessonType = "all";
            this.selectedTeacherId = "";
            this.selectedAttribute = "topic";
            this.selectedOrder = "asc";
        },
        openLessonPopup(selectedLesson){
            this.selectedLesson = selectedLesson
            this.showPopup = true;
        },
        closeLessonPopup(){
            this.showPopup = false;
            this.selectedLesson = null
        },
        openLoginForm(){
            if (this.currentUser){
                this.showLogOutDropDown = !this.showLogOutDropDown;
                return;
            }
            this.clearFormsLoginRegistrationForm();
            this.showPopup = true;
            this.showRegistrationForm = false ;
            this.showLoginForm = true;
        },
        openRegistrationForm(){
            this.clearFormsLoginRegistrationForm();
            this.showPopup = true;
            this.showLoginForm = false;
            this.showRegistrationForm = true ;
        },
        closeLoginRegistrationForm(){
            this.clearFormsLoginRegistrationForm();
            this.showPopup = false;
            this.showLoginForm = false;
            this.showRegistrationForm = false ;
        },
        clearFormsLoginRegistrationForm(){
            this.loginEmail = "",
            this.loginPassword = "",
            this.registerName = "",
            this.registerEmail = "",
            this.registerPassword = "",
            this.passwordFocused = false;
            this.authenticationError ="";
        },
        async loginUser(){
            try{
                const url = `${baseURL}/login`;
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.loginEmail,
                        password: this.loginPassword
                    })
                };
                const response = await (fetch (url, options));
                const result = await response.json();

                if (response.ok){
                    this.currentUser = result.user;
                    this.showMessage("Login Successful !");
                    this.loadUserData();
                    this.closeLoginRegistrationForm();
                }else{
                    this.authenticationError = result.message;
                }
            }catch(err){
                console.log("Failed to login: ", err);
                this.authenticationError = "An error occured during login. Please try again.";
            }
        },
        async registerUser(){
            try{
                const url = `${baseURL}/register`;
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName: this.registerName,
                        email: this.registerEmail,
                        password: this.registerPassword
                    })
                };
                const response = await (fetch (url, options));
                const result = await response.json();

                if (response.ok){
                    this.currentUser = result.user;
                    this.showMessage("Registration Successful !")
                    this.closeLoginRegistrationForm();

                }else{
                    this.authenticationError = result.message;
                }
            }catch(err){
                console.log("Failed to register: ", err);
                this.authenticationError = "An error occured during registration. Please try again.";
            }
        },
        async logOut(){
            try{
                const url = `${baseURL}/login`;
                const options = {
                    method: 'DELETE'
                };
                const response = await (fetch (url, options));
                const result = await response.json();

                if (response.ok){
                    this.currentUser = null;
                }

                this.showMessage(result.message);
                this.showLogOutDropDown = false;
                
            }catch(err){
                console.log("Failed to register: ", err);
                this.showMessage("Error. Please log out again.")
            }
        },
        addToCart(item){
            if (this.cart[item._id] === undefined){
                this.cart[item._id] = {itemObj: item, count: 1};
            }else{
                this.cart[item._id].count ++;
            }
            item.space --;
            this.showMessage("Item added to cart");
        },
        canAddToCart(item){
            return (item.space > 0)
        },
        confirmRemove(item){
            this.itemToDelete = item;
            this.showPopup=true;
        },
        closeRemoveConfirmationPopup(){
            this.showPopup = false;
            this.itemToDelete = null;
        },
        removeFromCart(itemId){
            const cartItem = this.cart[itemId];
            if (!cartItem) return;

            cartItem.itemObj.space += cartItem.count;
            delete this.cart[itemId];
            this.closeRemoveConfirmationPopup();

            // redirect to browse page if all items have been removed from cart
            if(this.getCartCount === 0){
                this.showMessage("Your cart is now empty. Browse to add more!");
                this.navigateTo('browsing');
            }else{
                this.showMessage("Item removed from cart");
            }
        },
        changeCartQuantity(itemId, change){
            const cartItem = this.cart[itemId];
            if (!cartItem) return;

            if(change === -1){
                if (cartItem.count === 1){
                    this.confirmRemove(cartItem.itemObj);
                }else{
                    // decreasing quantity
                    cartItem.count --;
                    cartItem.itemObj.space ++;
                }

            // increasing quantity
            }else if (change === 1 && cartItem.itemObj.space > 0){
                cartItem.count ++;
                cartItem.itemObj.space --;
            }
        },
        showMessage(text){
            this.showMessagePopup = true;
            this.messageText = text;

            setTimeout(() => {
                this.showMessagePopup = false;
                this.messageText = "";
            }, 1500);
        },
        checkout(){
            if (this.getCartCount === 0 || !this.canCheckout){
                this.showMessage("Please check your details and cart");
                return;
            }
            
            this.saveOrder();

            // display message
            this.checkoutComplete = true;
            this.showPopup=true;
        },
        closeCheckoutPopup(){
            this.checkoutComplete = false;
            this.showPopup=false;
            
            // clear cart
            this.cart = {}
            this.navigateTo('browsing');
        },
        // check string contains letters only
        containsLettersOnly(name){
            return onlyLettersRegex.test(name);
        },
        clearCheckoutForm(){
            this.checkout_full_name = "";
            this.checkout_phone_number= "";
        },
        saveOrder(){
            const lessonsOrdered = Object.entries(this.cart).map(( [key, value] ) => {
                return {
                    lessonId: key,
                    space: value.count
                };

            });

            const newOrder={
                userId: this.currentUser._id,
                name: this.checkout_full_name,
                phoneNumber: this.checkout_phone_number,
                lessonIDs: lessonsOrdered,
                orderDate: new Date().toISOString().split('T')[0],
                totalPrice: this.getCartTotal
            }

            // save order to database


            this.orders.push(newOrder);
        },
        async saveLesson(lesson){
            // check if user is logged in
            if (!this.currentUser){
                this.showMessage("Login to save lessons");
                return;
            }

            if (this.currentUser.savedLessonIDs.includes(lesson._id)){
                // unsave
                const result = await this.updateSavedLesson(lesson._id, 'DELETE');
                if (result.lessonUnsaved){
                    this.currentUser.savedLessonIDs = this.currentUser.savedLessonIDs.filter(id => id !== lesson._id);
                    this.showMessage(`${lesson.itemType} removed from saves`);
                }else{
                    this.showMessage(`Error unsaving ${lesson.itemType}`);
                }

            }else{
                // save
                const result = await this.updateSavedLesson(lesson._id, 'PUT');
                if (result.lessonSaved){
                    this.currentUser.savedLessonIDs.push(lesson._id);
                    this.showMessage(`${lesson.itemType} saved`);
                }else{
                    this.showMessage(`Error saving ${lesson.itemType}`);
                }
            }
        },
        async updateSavedLesson(lessonId, method){
            try{
                const url = `${baseURL}/saved-lessons/${lessonId}`;
                const options = {
                    method: method,
                };

                const response = await (fetch (url, options));

                if (!response.ok){
                    throw new Error(`HTTP error ! status: ${response.status}`)
                }

                return await response.json();
            }catch(err){
                console.log("Failed to update saved lesson: ", err);
                return false;
            }
        },
        toggleOrder(orderId){
            const index = this.expandedOrders.indexOf(orderId);
            if (index === -1){
                this.expandedOrders.push(orderId);
            }else{
                this.expandedOrders.splice(index, 1)
            }   
        },
        getLessonRating(lessonId){
            // get rating that user gave to a lesson
            return this.userRatings.find(rating => 
                rating.userId === this.currentUser._id &&
                rating.lessonId === lessonId
            );
        },
        openRatingPopup(lesson){
            this.ratedItem = lesson;
            this.showPopup = true;
        },
        closeRatingPopup(){
            this.showPopup = false;
            this.ratedItem = null;
            this.selectedRating = 0;
        },
        rateItem(){
            const existingRating = this.getLessonRating(this.ratedItem._id);
            if (existingRating){
                // edit rating
                this.ratedItem.rating -= existingRating.rating
                existingRating.rating = this.selectedRating;
                this.ratedItem.rating += this.selectedRating
            }else{
                // record new rating
                const newRating = {
                    userId: this.currentUser._id,
                    lessonId: this.ratedItem._id,
                    rating: this.selectedRating,
                }
                ratings.push(newRating)

                this.userRatings.push(newRating)
                
                // update lesson rating
                this.ratedItem.rating += this.selectedRating
                this.ratedItem.ratingCount += 1
            }
            this.closeRatingPopup();
        },
        async fetchUserRatings(){
            // retrieves all ratings done by user
            try{
                const url = `${baseURL}/ratings`;
                const response = await fetch(url);

                if (!response.ok){
                    throw new Error(`HTTP error ! status: ${response.status}`)
                }
                this.userRatings = await response.json();

            }catch(err){
                console.log("Failed to retrieve ratings from user: ", err);
            }
        },
        async fetchLessons(){
            try{
                const url = `${baseURL}/lessons`;
                const response = await fetch(url);

                if (!response.ok){
                    throw new Error(`HTTP error ! status: ${response.status}`)
                }
                this.lessons = await response.json();

            }catch(err){
                console.log("Failed to retrieve lessons and activities: ", err);
            }
        },
        async fetchTeachers(){
            try{
                const url = `${baseURL}/teachers`;
                const response = await fetch(url);

                if (!response.ok){
                    throw new Error(`HTTP error ! status: ${response.status}`)
                }
                this.teachers = await response.json();

            }catch(err){
                console.log("Failed to retrieve teachers: ", err);
            }
        },
        async searchLessons(){
            try{
                const url = `${baseURL}/lessons/search?q=${this.searchedText.trim()}`;
                const response = await fetch(url);

                if (!response.ok){
                    throw new Error(`HTTP error ! status: ${response.status}`)
                }
                this.searchResults = await response.json();

            }catch(err){
                console.log("Failed to retrieve teachers: ", err);
            }finally{
                this.isSearching=false;
            }
        },
        debounce(fn, ms){
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => fn(...args), ms);
            };
        },
        onSearchInput(){
            // prevent request for empty search
            if (!this.searchedText.trim()){
                this.isSearching=false;
                this.searchResults = [];
                return;
            }
            this.isSearching=true;
            this.debouncedSearch();
        },
        async fetchOrderHistory(){
            try{
                const url = `${baseURL}/history`;
                const response = await fetch(url);

                if (!response.ok){
                    throw new Error(`HTTP error ! status: ${response.status}`)
                }
                this.orders = await response.json();

            }catch(err){
                console.log("Failed to retrieve order history: ", err);
            }
        },
        // retrieve user's data after they've logged in
        async loadUserData(){
            await this.fetchOrderHistory();
            await this.fetchUserRatings();
        }
    },
    computed:{
        displayedItems(){
            let lessonsArr;

            // saved lessons
            if (this.currentPage === 'savedItems'){
                const savedItems = this.currentUser.savedLessonIDs.toReversed();
                return savedItems.map(lessonID => this.lessons.find(lesson => lesson._id === lessonID));
            }

            // check if filtering result of search or all lessons
            if (this.searchedText.trim()){
                lessonsArr = this.searchResults;
            }else{
                lessonsArr = this.lessons;
            }

            // filter lessons
            const results = lessonsArr.filter(lesson => {
                // filter by selected teacher
                const matchTeacher = 
                    !this.selectedTeacherId.trim() || 
                    lesson.teacherId === this.selectedTeacherId;

                // filter by lesson/activity
                const matchItemType =
                    this.selectedLessonType === "all" ||
                    lesson.itemType === this.selectedLessonType;

                return matchTeacher && matchItemType;
            });

            return this.sortItems(results);
        },
        // // name check
        containsNumbersOnly(){
            return onlyNumbersRegex.test(this.checkout_phone_number);
        },
        // password checks
        isMinLength(){
            return this.registerPassword.length >= 8;
        },
        containsNum(){
            return numberRegx.test(this.registerPassword);
        },
        containsUpperCase(){
            return upperCaseRegex.test(this.registerPassword);
        },
        canAttemptLogin(){
            return (this.loginEmail && this.loginPassword);
        },
        canAttemptRegistration(){
            return (
                this.registerName && this.registerEmail && this.registerPassword &&
                this.containsLettersOnly(this.registerName) &&
                this.isMinLength && this.containsNum && this.containsUpperCase
            );
        },
        getCartCount(){
            let count = 0;

            Object.values(this.cart).forEach(value => {
                count += value.count;
            });
            return count;
        },
        getCartTotal(){
            let total = 0;

            Object.values(this.cart).forEach(value => {
                total += (value.itemObj.price * value.count);
            });
            return Math.round(total * 100) / 100 ;
        },
        canCheckout(){
            return (
                this.containsLettersOnly(this.checkout_full_name) && 
                this.containsNumbersOnly &&
                this.checkout_phone_number.length >= 7
            );
        },
        ordersWithLessonDetails(){
            return this.orders.map(order => ({
                ...order,
                itemDetails: order.lessonIDs.map(item => ({
                    ...item,
                    lesson: this.lessons.find( lesson => lesson._id === item.lessonId)
                }))
            }));
        },
        sortedOrders(){
            const orders = [...(this.ordersWithLessonDetails || [])];

            if (this.selectedHistoryOrder === "asc"){
                return orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            }else{
                return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            }
        }
    }
})
myApp.mount("#afterSchoolApp")