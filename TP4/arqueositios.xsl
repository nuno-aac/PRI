<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        
        <xsl:result-document href="tabsite/index.html">
            <html>
                <head>
                    <link rel="stylesheet" href="http://localhost:7777/css/content.css"/>
                    <title>Arqueositios</title>
                </head>
                <body class="Index">
                    <h2>Arqueosítios</h2>
                    <div >
                        <ul class="List">
                            <xsl:apply-templates mode="indice" select="//ARQELEM">
                                <xsl:sort select="IDENTI"/>
                            </xsl:apply-templates>
                        </ul>
                    </div>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
        
    </xsl:template>
    <!--  Templates para o índice ............................................ -->
    <xsl:template match="ARQELEM" mode="indice">
        
        <li style="margin-bottom: 10px;">
            <a name="i{count(preceding::ARQELEM)}" />
            <a href="{count(preceding::ARQELEM)}">
                <img style="height: 1em; width: 1em; margin-right: 10px" src="http://localhost:7777/resources/icon.svg" alt="arq"/>
                <xsl:value-of select="IDENTI"/>
                -
                <xsl:value-of select="LUGAR"/>
            </a>
        </li>
        
    </xsl:template>
    <!--  Templates para o conteúdo ............................................ -->
    <xsl:template match="ARQELEM">
        
        <xsl:result-document href="tabsite/{count(preceding::ARQELEM)}.html">
            <html>
                <head>
                    <link rel="stylesheet" href="http://localhost:7777/css/content.css"/>
                    <title>
                        <xsl:value-of select="IDENTI"/>
                    </title>
                </head>
                <body class="Content">
                    <p>
                        <h2 style="margin:20px;"><xsl:value-of select="IDENTI"/></h2>
                    </p>
                    <p>
                        <b>Freguesia</b>
                        :
                        <xsl:value-of select="FREGUE"/>
                    </p>
                    <p>
                        <b>Concelho</b>
                        :
                        <xsl:value-of select="CONCEL"/>
                    </p>
                    <xsl:if test="LATITU">
                        <p>
                            <b>[</b><a href="https://www.google.com/maps/search/?api=1&amp;query={IDENTI}"> Localização </a><b>]</b>
                            :
                            <xsl:value-of select="LATITU"/> / 
                            <xsl:value-of select="LONGIT"/> / 
                            <xsl:value-of select="ALTITU"/>
                        </p>
                    </xsl:if>
                    
                    <b>Descrição:</b><br/>
                    <p style="width: 75%; text-indent: 3em; margin-top:0;"><xsl:value-of select="DESARQ"/></p>
                    
                    <address style="margin-top:50px;">
                        [
                        <a href="*#i{count(preceding::ARQELEM)}">Voltar ao índice</a>
                        ]
                    </address>
                </body>
            </html>
        </xsl:result-document>
        
    </xsl:template>
</xsl:stylesheet>