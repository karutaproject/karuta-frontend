<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  
<xsl:include href="commonFunctions.xsl"/>
<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="span">
<!-- =====================================-->
	<xsl:variable name='style'><xsl:value-of select="@style"/></xsl:variable>
		<xsl:variable name="font-weight">
			<xsl:call-template name="lastIndexOfAB">
				 <xsl:with-param name="string" select="$style" />
				 <xsl:with-param name="a">font-weight: </xsl:with-param>
				 <xsl:with-param name="b">;</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
	<fo:inline>
		<xsl:if test="contains($style, 'font-weight')">
			<xsl:attribute name="font-weight">
				<xsl:value-of select="substring-after($font-weight,'font-weight:')"/>
			</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains($style, 'text-decoration')">
			<xsl:attribute name="text-decoration">
				<xsl:call-template name="lastIndexOfAB">
					 <xsl:with-param name="string" select="$style" />
					 <xsl:with-param name="a">text-decoration: </xsl:with-param>
					 <xsl:with-param name="b">;</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains($style, 'font-style')">
			<xsl:attribute name="font-style">
				<xsl:call-template name="lastIndexOfAB">
					 <xsl:with-param name="string" select="$style" />
					 <xsl:with-param name="a">font-style: </xsl:with-param>
					 <xsl:with-param name="b">;</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'color:')">
			<xsl:attribute name="color"><xsl:value-of select="substring-before(substring-after(@style,'color:'),';')"/></xsl:attribute>
		</xsl:if>
		<xsl:apply-templates select="*|text()"/>
  </fo:inline>
</xsl:template>

<!-- =====================================-->
<xsl:template match="br">
<!-- =====================================-->
	<fo:block line-height="5pt"><fo:inline><xsl:text>&#160;</xsl:text></fo:inline></fo:block>
</xsl:template>

<!-- =====================================-->
<xsl:template match="p">
<!-- =====================================-->
	<fo:block space-before="5pt" space-after="5pt">
		<xsl:apply-templates select="*|text()"/>
	</fo:block>
</xsl:template>

<!-- =====================================-->
<xsl:template match="img">
<!-- =====================================-->
	<xsl:variable name='nodeid'>
		<xsl:value-of select="substring(@id,7)"/>
	</xsl:variable>

	<xsl:variable name='src'>
		<xsl:value-of select="$urlimage"/>/resources/resource/file/<xsl:value-of select="$nodeid"/>?lang=<xsl:value-of select="$lang"/>&amp;size=L
	</xsl:variable>
	<xsl:variable name='width'>
		<xsl:value-of select="@width"/>
	</xsl:variable>
	<fo:block space-before="5pt" space-after="5pt">
	<fo:external-graphic vertical-align="middle" padding-left="5pt" content-width="scale-to-fit" content-height="100%" scaling="uniform">
				<xsl:attribute name="src"><xsl:value-of select="$src"/></xsl:attribute>
				<xsl:attribute name="width"><xsl:value-of select="$width"/></xsl:attribute>
	</fo:external-graphic>
	</fo:block>
</xsl:template>

<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="ul|ol">
<!-- =====================================-->
<xsl:if test="count(.//li) != 0">
	  <fo:list-block provisional-distance-between-starts="0.2cm" provisional-label-separation="0.2cm">
	    <xsl:attribute name="space-after">
	      <xsl:choose>
	        <xsl:when test="ancestor::ul or ancestor::ol">
	          <xsl:text>0pt</xsl:text>
	        </xsl:when>
	        <xsl:otherwise>
	          <xsl:text>12pt</xsl:text>
	        </xsl:otherwise>
	      </xsl:choose>
	    </xsl:attribute>
	    <xsl:attribute name="start-indent">
	      <xsl:variable name="ancestors">
	        <xsl:choose>
	          <xsl:when test="count(ancestor::ol) or count(ancestor::ul)">
	            <xsl:value-of select="0.2 + (count(ancestor::ol) + count(ancestor::ul)) * 0.2"/>
	          </xsl:when>
	          <xsl:otherwise>
	            <xsl:text>0.2</xsl:text>
	          </xsl:otherwise>
	        </xsl:choose>
	      </xsl:variable>
	      <xsl:value-of select="concat($ancestors, 'cm')"/>
	    </xsl:attribute>
	    <xsl:apply-templates select="*"/>
	  </fo:list-block>
	</xsl:if>
</xsl:template>

<!-- =====================================-->
<xsl:template match="ul/li">
<!-- =====================================-->
	<fo:list-item>
		<fo:list-item-label end-indent="label-end()">
			<fo:block margin-top="-3pt"><fo:inline font-family="Symbol" font-size="10pt" baseline-shift="super">&#8226;</fo:inline></fo:block>
		</fo:list-item-label>
		<fo:list-item-body start-indent="body-start()">
			<fo:block><xsl:apply-templates select="*|text()"/></fo:block>
		</fo:list-item-body>
	</fo:list-item>
</xsl:template>

<!-- =====================================-->
<xsl:template match="ol/li">
<!-- =====================================-->
  <fo:list-item>
    <fo:list-item-label end-indent="label-end()">
      <fo:block>
        <xsl:variable name="value-odr-li">
          <xsl:number level="multiple" count="li" format="1"/>
        </xsl:variable>
        <xsl:variable name="value-attr">
          <xsl:choose>
            <xsl:when test="../@start">
              <xsl:number value="$value-odr-li + ../@start - 1"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:number value="$value-odr-li"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:choose>
          <xsl:when test="../@type='i'">
            <xsl:number value="$value-attr" format="i."/>
          </xsl:when>
          <xsl:when test="../@type='I'">
            <xsl:number value="$value-attr" format="I."/>
          </xsl:when>
          <xsl:when test="../@type='a'">
            <xsl:number value="$value-attr" format="a."/>
          </xsl:when>
          <xsl:when test="../@type='A'">
            <xsl:number value="$value-attr" format="A."/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:number value="$value-attr" format="1."/>
          </xsl:otherwise>
        </xsl:choose>
      </fo:block>
    </fo:list-item-label>
    <fo:list-item-body start-indent="body-start()">
      <fo:block>
        <xsl:apply-templates select="*|text()"/>
      </fo:block>
    </fo:list-item-body>
  </fo:list-item>
</xsl:template>

<!-- =====================================-->
<xsl:template match="ul/ul|ul/ol|ol/ul|ol/ol">
<!-- =====================================-->
	<xsl:if test="count(.//li) != 0">
		<fo:list-item>
			<fo:list-item-label end-indent="label-end()">
				<fo:block></fo:block>
			</fo:list-item-label>
			<fo:list-item-body start-indent="body-start()">
				<fo:list-block provisional-distance-between-starts="0.2cm"
					provisional-label-separation="0.2cm">
					<xsl:attribute name="space-after">
						<xsl:choose>
							<xsl:when test="ancestor::ul or ancestor::ol">
								<xsl:text>0pt</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>12pt</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:attribute name="start-indent">
					<xsl:variable name="ancestors">
						<xsl:choose>
							<xsl:when test="count(ancestor::ol) or count(ancestor::ul)">
								<xsl:value-of select="0.2 + (count(ancestor::ol) + count(ancestor::ul)) * 0.2"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>0.2</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
						<xsl:value-of select="concat($ancestors, 'cm')"/>
					</xsl:attribute>
					<xsl:apply-templates select="*"/>
				</fo:list-block>
			</fo:list-item-body>
		</fo:list-item>
	</xsl:if>
</xsl:template>

<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="div [@id='qrcode']">
<!-- =====================================-->
	<fo:block text-align='right'>
			<xsl:variable name="qrcode">
				<xsl:value-of select="//asmContext[metadata/@semantictag='qrcode']/asmResource[@xsi_type='Field']/text" />
			</xsl:variable>
			<fo:external-graphic vertical-align="middle" content-width="scale-to-fit" width="100px" scaling="uniform">
				<xsl:attribute name="src">url('<xsl:value-of select="$qrcode"/>')</xsl:attribute>
			</fo:external-graphic>
	</fo:block>
</xsl:template>

<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="strong|b">
<!-- =====================================-->
  <fo:inline font-weight="bold">
    <xsl:apply-templates select="*|text()"/>
  </fo:inline>
</xsl:template>

<!-- =====================================-->
<xsl:template match="sup">
<!-- =====================================-->
	<fo:inline vertical-align="super"
	font-size="75%">
	<xsl:apply-templates select="*|text()"/>
	</fo:inline>
</xsl:template>

<!-- =====================================-->
<xsl:template match="sub">
<!-- =====================================-->
	<fo:inline vertical-align="sub"
	font-size="75%">
	<xsl:apply-templates select="*|text()"/>
	</fo:inline>
</xsl:template>

<!-- =====================================-->
<xsl:template match="em|i">
<!-- =====================================-->
	<fo:inline font-style="italic">
	<xsl:apply-templates select="*|text()"/>
	</fo:inline>
</xsl:template>

<!-- =====================================-->
<xsl:template match="u">
<!-- =====================================-->
	<fo:inline text-decoration="underline">
		<xsl:apply-templates select="*|text()"/>
	</fo:inline>
</xsl:template>

<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="a">
<!-- =====================================-->
  <xsl:choose>
    <xsl:when test="@name">
      <xsl:if test="not(name(following-sibling::*[1]) = 'h1')">
        <fo:block line-height="0" space-after="0pt" 
          font-size="0pt" id="{@name}"/>
      </xsl:if>
    </xsl:when>
    <xsl:when test="@href">
      <fo:basic-link color="blue">
        <xsl:choose>
          <xsl:when test="starts-with(@href, '#')">
            <xsl:attribute name="internal-destination">
              <xsl:value-of select="substring(@href, 2)"/>
            </xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="external-destination">
              <xsl:value-of select="@href"/>
            </xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="*|text()"/>
      </fo:basic-link>
      <xsl:if test="starts-with(@href, '#')">
        <xsl:text> on page </xsl:text>
        <fo:page-number-citation ref-id="{substring(@href, 2)}"/>
      </xsl:if>
    </xsl:when>
  </xsl:choose>
</xsl:template>
<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="table [@id='europass']">
<!-- =====================================-->
	<xsl:call-template name="europass" />
</xsl:template>

<!-- =====================================-->
<xsl:template match="table">
<!-- =====================================-->
	<fo:table width="100%">
		<fo:table-body>
			<xsl:apply-templates select="*[not(contains(@style,'display:none') or contains(@style,'display: none'))]"/>
		</fo:table-body>
	</fo:table>
</xsl:template>

<!-- =====================================-->
<xsl:template match="tr">
<!-- =====================================-->
	<fo:table-row>
			<xsl:apply-templates select="*[not(contains(@style,'display:none') or contains(@style,'display: none'))]"/>
	</fo:table-row>
</xsl:template>

<!-- =====================================-->
<xsl:template match="td">
<!-- =====================================-->
	<!--fo:table-cell padding="2px"-->
	<fo:table-cell>
		<xsl:if test="@colspan&gt;1">
			<xsl:attribute name="number-columns-spanned"><xsl:value-of select="@colspan"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'text-align:center')">
			<xsl:attribute name="text-align">center</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'text-align:right')">
			<xsl:attribute name="text-align">right</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'text-align:left')">
			<xsl:attribute name="text-align">left</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'font-weight:bold')">
			<xsl:attribute name="font-weight">bold</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'font-size:')">
			<xsl:attribute name="font-size"><xsl:value-of select="substring-before(substring-after(@style,'font-size:'),'pt')"/>pt</xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'color:')">
			<xsl:if test="not(substring(substring-before(@style,'color:'), string-length(substring-before(@style,'color:')), 1)='-')">
				<xsl:attribute name="color"><xsl:value-of select="substring-before(substring-after(@style,'color:'),';')"/></xsl:attribute>
			</xsl:if>
		</xsl:if>
		<xsl:if test="contains(@style,'background-color:')">
			<xsl:attribute name="background-color"><xsl:value-of select="substring-before(substring-after(@style,'background-color:'),';')"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="contains(@style,'width:')">
			<xsl:attribute name="width"><xsl:value-of select="substring-before(substring-after(@style,'width:'),';')"/></xsl:attribute>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="contains(@style,'border:0px') or contains(@style,'border: 0px') or contains(@style,'border: none') or contains(@style,'border:none')">
				<xsl:if test="contains(@style,'border-bottom')">
					<xsl:attribute name="border-bottom"><xsl:value-of select="substring-before(substring-after(@style,'border-bottom:'),';')"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="contains(@style,'border-top')">
					<xsl:attribute name="border-top"><xsl:value-of select="substring-before(substring-after(@style,'border-bottom:'),';')"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="contains(@style,'border-left')">
					<xsl:attribute name="border-left"><xsl:value-of select="substring-before(substring-after(@style,'border-bottom:'),';')"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="contains(@style,'border-right')">
					<xsl:attribute name="border-right"><xsl:value-of select="substring-before(substring-after(@style,'border-bottom:'),';')"/></xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="contains(@style,'border-bottom')">
					<xsl:attribute name="border-bottom"><xsl:value-of select="substring-before(substring-after(@style,'border-bottom:'),';')"/></xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
					<xsl:attribute name="border">1px solid gray</xsl:attribute>
			</xsl:otherwise>	
		</xsl:choose>

		<fo:block>
			<xsl:apply-templates select="*[not(contains(@style,'display:none'))]"/>
		<!--xsl:choose>
			<xsl:when test="./span/div/img">
				<xsl:apply-templates select="./span/div/img"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="*[not(contains(@style,'display:none'))]"/>
			</xsl:otherwise>
		</xsl:choose-->
		
		</fo:block>
	</fo:table-cell>
</xsl:template>

<!-- ========================================== -->
<xsl:template name="europass">
<!-- ========================================== -->
	<fo:block margin-top='10px' margin-bottom='10px' >
		<fo:table width="100%">
			<fo:table-column column-width="20%"/>
			<fo:table-column column-width="80%"/>
			<fo:table-body>
				<xsl:call-template name="mother-tongue" />
				<xsl:call-template name="other-tongue" />
			</fo:table-body>
		</fo:table>
	</fo:block>
</xsl:template>

<!-- ========================================== -->
<xsl:template name="mother-tongue">
<!-- ========================================== -->
		<fo:table-row>
			<fo:table-cell padding-top='5pt' padding-right='5pt'>
				<fo:block>Langue Maternelle</fo:block>
			</fo:table-cell>
			<fo:table-cell padding-top='5pt' padding-right='5pt'>
				<fo:block><xsl:value-of select="//span[@class='mothertongue-value']" /></fo:block>
			</fo:table-cell>
		</fo:table-row>
</xsl:template>

<!-- ========================================== -->
<xsl:template name="other-tongue">
<!-- ========================================== -->
		<fo:table-row>
			<fo:table-cell padding-top='5pt' padding-right='5pt'>
				<fo:block>Langue(s) Étrangère(s)</fo:block>
			</fo:table-cell>
			<fo:table-cell padding-top='5pt' padding-right='5pt'>
				<!-- ===================== -->
				<fo:table width="100%">
					<fo:table-body>
						<fo:table-row>
							<fo:table-cell>
								<fo:block> </fo:block>
							</fo:table-cell>
							<fo:table-cell border="1px solid lightgrey" number-columns-spanned="2">
								<fo:block font-size="9pt" text-align="center" margin-top='4px' >
									COMPRENDRE
								</fo:block>
							</fo:table-cell>
							<fo:table-cell border="1px solid lightgrey" number-columns-spanned="2">
								<fo:block  font-size="9pt" text-align="center" margin-top='4px' >
									PARLER
								</fo:block>
							</fo:table-cell>
							<fo:table-cell border="1px solid lightgrey">
								<fo:block  font-size="9pt" text-align="center" margin-top='4px' >
									ÉCRIRE
								</fo:block>
							</fo:table-cell>
						</fo:table-row>
						<xsl:for-each select="//tr[@class='other-tongue']">
							<xsl:call-template name="langue"/>
						</xsl:for-each>
					</fo:table-body>
				</fo:table>
				<!-- ===================== -->
			</fo:table-cell>
		</fo:table-row>
</xsl:template>

<!-- ========================================== -->
<xsl:template name="langue">
<!-- ========================================== -->
	<fo:table-row>
		<fo:table-cell>
			<fo:block  font-size="9pt" margin-top='4px'>
				<fo:block><xsl:value-of select=".//td[contains(@class,'language')]/span" /></fo:block>
			</fo:block>
		</fo:table-cell>
		<fo:table-cell border="1px solid lightgrey">
			<fo:block  font-size="9pt" text-align="center" margin-top='4px'>
				<fo:block><xsl:value-of select=".//td[contains(@class,'listening')]" /></fo:block>
			</fo:block>
		</fo:table-cell>
		<fo:table-cell border="1px solid lightgrey">
			<fo:block  font-size="9pt" text-align="center" margin-top='4px'>
				<fo:block><xsl:value-of select=".//td[contains(@class,'reading')]" /></fo:block>
			</fo:block>
		</fo:table-cell>
		<fo:table-cell border="1px solid lightgrey">
			<fo:block  font-size="9pt" text-align="center" margin-top='4px'>
				<fo:block><xsl:value-of select=".//td[contains(@class,'spoken-interaction')]" /></fo:block>
			</fo:block>
		</fo:table-cell>
		<fo:table-cell border="1px solid lightgrey">
			<fo:block  font-size="9pt" text-align="center" margin-top='4px'>
				<fo:block><xsl:value-of select=".//td[contains(@class,'spoken-production')]" /></fo:block>
			</fo:block>
		</fo:table-cell>
		<fo:table-cell border="1px solid lightgrey">
			<fo:block  font-size="9pt" text-align="center" margin-top='4px'>
				<fo:block><xsl:value-of select=".//td[contains(@class,'writing')]" /></fo:block>
			</fo:block>
		</fo:table-cell>
	</fo:table-row>
</xsl:template>

</xsl:stylesheet>