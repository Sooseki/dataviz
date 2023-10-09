import Head from "next/head";

const MetaHead: React.FC = () => (
    <Head>
       
       <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WR2M7JXLC3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WR2M7JXLC3');
</script>
    
    <div id="diagnostics-container"></div>
    <script>
        // Utilisez fetch pour récupérer le contenu de diagnostics.html
        fetch('../../../scripts/diagnostics.html')
            .then(response => response.text())
            .then(html => {
                // Ajoutez le contenu de diagnostics.html à la div avec l'ID "diagnostics-container"
                document.getElementById('diagnostics-container').innerHTML = html;
            })
            .catch(error => {
                console.error('Erreur lors du chargement de diagnostics.html :', error);
            });
    </script>
    
        <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
);

export default MetaHead;
