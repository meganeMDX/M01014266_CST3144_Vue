import {teachers, lessons, users, orders, ratings} from './data.js';

const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:[],
            currentPage:'browsing',
            lessons:lessons,
            searchedText: "",
            teachers: teachers,
            selectedTeacherId: ""
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
        filteredItems(){
            const searchedTextLowerCase = this.searchedText.trim().toLowerCase();

            return this.lessons.filter(lesson => {

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

                return matchSearch && matchTeacher;

            })
        }

    }
})
myApp.mount("#afterSchoolApp")