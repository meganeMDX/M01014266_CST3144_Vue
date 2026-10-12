const {createApp} = Vue
const myApp = Vue.createApp({
    data(){
        return{
            cart:[],
            currentPage:'browsing',
            lessons:[]
        }
    },
    methods:{
        navigateTo(pageName){
            this.currentPage = pageName;
            window.scrollTo(0,0)
        }

    },
    computed:{

    }
})
myApp.mount("#afterSchoolApp")