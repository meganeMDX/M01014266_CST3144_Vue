import {teachers, lessons, users, orders, ratings} from './data.js';

const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:[],
            currentPage:'browsing',
            lessons:lessons
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

    }
})
myApp.mount("#afterSchoolApp")