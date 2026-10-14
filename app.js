import {teachers, lessons, users, orders, ratings} from './data.js';

const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:[],
            currentPage:'browsing',
            lessons:lessons,
            searchedText: ""
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
        }

    },
    computed:{
        // return lessons with the searched text in its title, location, price or availability
        filteredItems(){
            if (!this.searchedText.trim()){
                return this.lessons;
            }

            const searchedTextLowerCase = this.searchedText.trim().toLowerCase();
            return this.lessons.filter(lesson =>
                lesson.topic.toLowerCase().includes(searchedTextLowerCase) ||
                lesson.location.toLowerCase().includes(searchedTextLowerCase) ||
                String(lesson.price).includes(searchedTextLowerCase) ||
                String(lesson.space).includes(searchedTextLowerCase)
            );
        }

    }
})
myApp.mount("#afterSchoolApp")