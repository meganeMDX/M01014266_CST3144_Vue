import {teachers, lessons, users, orders, ratings} from './data.js';

const userTemp = {
        id: "001",
        name: "Christy Watson",
        email: "christy@gmail.com",
        password: "C12345678",
        savedLessonIDs: ["001"]
    };

const numberRegx = /\d/;
const upperCaseRegex = /(?=.*[A-Z])/;
const onlyLettersRegex = /^[A-Za-z]+$/;
const onlyNumbersRegex = /^\d+$/;

const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:{},
            currentPage:'browsing',
            lessons:lessons,
            teachers: teachers,
            orders: orders,

            searchedText: "",
            selectedTeacherId: "",
            selectedAttribute:"topic",
            selectedOrder:"asc",
            selectedLessonType: "all",

            showPopup: false,
            selectedLesson: null,
            showLoginForm:false,
            showRegistrationForm:false,

            login_email: "",
            login_password:"",
            register_name: "",
            register_email: "",
            register_password: "",
            // currentUser:null,
            currentUser:userTemp,

            passwordFocused: false,

            messageText: "",
            showMessagePopup : false,

            checkout_full_name: "",
            checkout_phone_number: "",

            itemToDelete: null,

            checkoutComplete:false,
        }
    },
    methods:{
        navigateTo(pageName){
            if (this.currentPage === 'cart'){
                this.clearCheckoutForm();
            };

            if (this.currentPage === 'browsing' || this.currentPage === 'savedItems'){
                this.clearFilters();
            }

            this.currentPage = pageName;
            window.scrollTo(0,0);
        },
        getTeacherName(teacherId){
            let teacher = teachers.find(teacher => teacher.id === teacherId);
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
            this.login_email = "",
            this.login_password = "",
            this.register_name = "",
            this.register_email = "",
            this.register_password = "",
            this.passwordFocused = false;
        },
        loginUser(){

        },
        registerUser(){

        },
        addToCart(item){
            if (this.cart[item.id] === undefined){
                this.cart[item.id] = {itemObj: item, count: 1};
            }else{
                this.cart[item.id].count ++;
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
            this.showMessage("Item removed from cart");
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
                userId: this.currentUser.id,
                name: this.checkout_full_name,
                phoneNumber: this.checkout_phone_number,
                lessonIDs: lessonsOrdered,
                orderDate: new Date().toISOString().split('T')[0],
                totalPrice: this.getCartTotal
            }

            // save order to database


            this.orders.push(newOrder);
        },
        saveLesson(lesson){
            // check if user is logged in
            if (!this.currentUser){
                this.showMessage("Login to save lessons");
                return;
            }

            if (this.currentUser.savedLessonIDs.includes(lesson.id)){
                // unsave
                this.currentUser.savedLessonIDs = this.currentUser.savedLessonIDs.filter(id => id !== lesson.id);
                this.showMessage(`${lesson.itemType} removed from saves`);

            }else{
                // save
                this.currentUser.savedLessonIDs.push(lesson.id);
                this.showMessage(`${lesson.itemType} saved`);
            }
        }
    },
    computed:{
        filteredItems(){
            let lessonsArr;

            // check if user is on browsing page or saved items page
            if (this.currentPage === 'browsing'){
                lessonsArr = this.lessons;
            }else{
                if (!this.currentUser){
                    return [];
                }
                lessonsArr = this.lessons.filter(lesson => 
                    this.currentUser.savedLessonIDs.includes(lesson.id)
                );
            }

            // filter lessons
            const searchedTextLowerCase = this.searchedText.trim().toLowerCase();

            const results = lessonsArr.filter(lesson => {
                // find lessons with the searched text in its title, location, price or availability
                const matchSearch = 
                    !searchedTextLowerCase || 
                    lesson.topic.toLowerCase().includes(searchedTextLowerCase) ||
                    lesson.location.toLowerCase().includes(searchedTextLowerCase) ||
                    String(lesson.price).includes(searchedTextLowerCase) ||
                    String(lesson.space).includes(searchedTextLowerCase);

                // filter by selected teacher
                const matchTeacher = 
                    !this.selectedTeacherId.trim() || 
                    lesson.teacherId === this.selectedTeacherId;

                // filter by lesson/activity
                const matchItemType =
                    this.selectedLessonType === "all" ||
                    lesson.itemType === this.selectedLessonType;

                return matchSearch && matchTeacher && matchItemType;
            });

            return this.sortItems(results);
        },
        savedItems(){
            const searchedTextLowerCase = this.searchedText.trim().toLowerCase();

            const results = this.currentUser.savedLessonIDs.filter(lesson => {
                // find lessons with the searched text in its title, location, price or availability
                const matchSearch = 
                    !searchedTextLowerCase || 
                    lesson.topic.toLowerCase().includes(searchedTextLowerCase) ||
                    lesson.location.toLowerCase().includes(searchedTextLowerCase) ||
                    String(lesson.price).includes(searchedTextLowerCase) ||
                    String(lesson.space).includes(searchedTextLowerCase);

                // filter by selected teacher
                const matchTeacher = 
                    !this.selectedTeacherId.trim() || 
                    lesson.teacherId === this.selectedTeacherId;

                // filter by lesson/activity
                const matchItemType =
                    this.selectedLessonType === "all" ||
                    lesson.itemType === this.selectedLessonType;

                return matchSearch && matchTeacher && matchItemType;
            });

            return this.sortItems(results);
        },
        // // name check
        containsNumbersOnly(){
            return onlyNumbersRegex.test(this.checkout_phone_number);
        },
        // password checks
        isMinLength(){
            return this.register_password.length >= 8;
        },
        containsNum(){
            return numberRegx.test(this.register_password);
        },
        containsUpperCase(){
            return upperCaseRegex.test(this.register_password);
        },
        canAttemptLogin(){
            return (this.login_email && this.login_password);
        },
        canAttemptRegistration(){
            return (
                this.register_name && this.register_email && this.register_password &&
                this.containsLettersOnly(this.register_name) &&
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
        }
    }
})
myApp.mount("#afterSchoolApp")