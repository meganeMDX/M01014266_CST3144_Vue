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

    },
    computed:{

    }
})
myApp.mount("#afterSchoolApp")