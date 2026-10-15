import {teachers, lessons, users, orders, ratings} from './data.js';

const numberRegx = /\d/;
const upperCaseRegex = /(?=.*[A-Z])/;
const onlyLettersRegex = /^[A-Za-z]+$/;

const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:[],
            currentPage:'browsing',
            lessons:lessons,
            teachers: teachers,

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
            currentUser:null,

            passwordFocused: false
        }
    },
    methods:{
        navigateTo(pageName){
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
            console.log(selectedLesson);
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

        }
    },
    computed:{
        filteredItems(){
            const searchedTextLowerCase = this.searchedText.trim().toLowerCase();

            const results = this.lessons.filter(lesson => {
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
        // name check
        containsLettersOnly(){
            return onlyLettersRegex.test(this.register_name);
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
                this.containsLettersOnly &&
                this.isMinLength && this.containsNum && this.containsUpperCase
            );
        }
    }
})
myApp.mount("#afterSchoolApp")