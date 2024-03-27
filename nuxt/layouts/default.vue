<script setup lang="ts">

</script>
<template>
    <main role="main">
        <header>
            <div>
                <nav>
                    <ul>
                        <li><nuxt-link to="/">Home</nuxt-link></li>
                    </ul>
                </nav>
            </div>
        </header>
        <slot />

        <footer>
     
        </footer>
    </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}


main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: white;
  padding: 25px 25px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
}

nav ul {
  list-style: none;
}

nav ul li {
  display: inline-block;
  margin-left: 40px;
}

nav ul li a {
  color: black;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 20px;
    
}

nav ul li a:hover {
  color: #ccc;
}

footer {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  margin-top: auto;
  text-align: center;
}
</style>