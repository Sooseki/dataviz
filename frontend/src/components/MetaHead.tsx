import Head from "next/head";

const MetaHead: React.FC = () => (
    <Head>
       
    <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NQ34QDHL');
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
