<template>
    <div class="relative hidden md:block">
      <iframe ref="iframe" src="/" class="h-[668px] md:h-[768px] border-8 rounded-[50px] w-full max-w-sm mx-auto md:scale-75 md:fixed top-0"></iframe>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      const iframe = this.$refs.iframe;
      iframe.onload = () => {
        const style = document.createElement('style');
        style.innerHTML = `
          ::-webkit-scrollbar { display: none; }
          body { scrollbar-width: none; -ms-overflow-style: none; }
        `;
        iframe.contentDocument.head.appendChild(style);
      };
    }
  }
  </script>
  