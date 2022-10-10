<template>
    <h1>
        你好世界
    </h1>
    <p>{{ddd}}</p>
    <home></home>
</template>

<script>
import home from './views/Home.vue'
export default {
    data(){
        return{
            ddd:'小稀客'
        }
    },
    components :{
        home
    }
}
</script>

<style>
h1 {
    background-color: aquamarine;
}
</style>