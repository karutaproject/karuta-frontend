<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

<xsl:include href="html2fo_base.xsl"/>
<xsl:variable name="portfolio_code"><xsl:value-of select="//portfolio[1]/asmRoot/asmResource[@xsi_type='nodeRes']/code"/></xsl:variable>
<!-- =================================== -->
<xsl:template name="tree">
<!-- =================================== -->
	<fo:page-sequence master-reference="default-sequence">
		<fo:static-content flow-name="Footer" font-size="8pt">
			<fo:block><xsl:value-of select="$portfolio_code"/></fo:block>
			<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
		</fo:static-content>
		<fo:flow flow-name="Content" font-size="9pt">
			<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="0pt" text-align="center">
				<xsl:value-of select="$portfolio_code"/>
			</fo:block>
			<xsl:for-each select="//portfolio/asmRoot/asmStructure[not(metadata-wad/@display='N')]">
					<fo:block font-size="11pt" font-weight="bold" space-before="24pt" space-after="0pt">
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
					<fo:block margin-left="10pt">
						<xsl:for-each select="asmStructure[not(metadata-wad/@display='N')]|asmUnit[not(metadata-wad/@display='N')]">
								<xsl:choose>
								<xsl:when test="local-name()='asmStructure'">
									<xsl:call-template name="node_asmStructure"/>
								</xsl:when>
								<xsl:when test="local-name()='asmUnit'">
									<xsl:call-template name="node_asmUnit"/>
								</xsl:when>
								<xsl:otherwise>
								</xsl:otherwise>
								</xsl:choose>
						</xsl:for-each>
					</fo:block>
			</xsl:for-each>
		</fo:flow>
	</fo:page-sequence>
</xsl:template>

<!-- =================================== -->
<xsl:template name="node_asmStructure">
<!-- =================================== -->
	<fo:block font-size="10pt" font-style="italic" space-before="5pt" space-after="5pt">
		<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
	</fo:block>
	<fo:block margin-left="10pt">
		<xsl:for-each select="asmStructure[not(metadata-wad/@display='N')]|asmUnit[not(metadata-wad/@display='N')]">
				<xsl:choose>
					<xsl:when test="local-name()='asmStructure'">
						<xsl:call-template name="node_asmStructure"/>
					</xsl:when>
					<xsl:when test="local-name()='asmUnit'">
						<xsl:call-template name="node_asmUnit"/>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
		</xsl:for-each>
	</fo:block>
</xsl:template>

<!-- =================================== -->
<xsl:template name="node_asmUnit">
<!-- =================================== -->
	<fo:table width="100%" table-layout="fixed">
		<fo:table-column column-width="80%"/>
		<fo:table-column column-width="20%"/>
		<fo:table-body>
			<fo:table-row>
				<fo:table-cell>
					<fo:block text-align="left" margin-top='5px'>
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell>
					<fo:block text-align="right" margin-top='5px' margin-right='5px'>
						<fo:page-number-citation ref-id="{generate-id(.)}"/>
					</fo:block>
				</fo:table-cell>
			</fo:table-row>
		</fo:table-body>
	</fo:table>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmRoot ================ -->
<!-- =================================== -->
<xsl:template match="asmRoot">
		<xsl:variable name="asmNode_label"><xsl:value-of select="../asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
		<xsl:call-template name="welcome_page"/>
		<xsl:if test="asmUnitStructure[not(metadata-wad/@display='N')] | asmContext[not(metadata-wad/@display='N')]">
			<fo:page-sequence master-reference="default-sequence" id="{generate-id(.)}">
				<fo:static-content flow-name="Footer" font-size="8pt">
					<fo:block><xsl:value-of select="$portfolio_code"/> - <xsl:value-of select="$asmNode_label"/></fo:block>
					<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
				</fo:static-content>
				<fo:flow flow-name="Content" font-size="9pt">
					<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt">
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
					<xsl:apply-templates select="asmUnitStructure | asmContext">
						<xsl:with-param name="size">12pt</xsl:with-param>
					</xsl:apply-templates>
				</fo:flow>
			</fo:page-sequence>
		</xsl:if>
		<xsl:apply-templates select="./asmStructure|asmUnit[not(metadata-wad/@display='N' or contains(.//metadata/@semantictag, 'welcome-unit'))]"/>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmStructure =========== -->
<!-- =================================== -->
<xsl:template match="asmStructure">
	<xsl:variable name="asmNode_label"><xsl:value-of select="../asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
	<xsl:if test="asmUnitStructure | asmContext">
		<fo:page-sequence master-reference="default-sequence" id="{generate-id(.)}">
			<fo:static-content flow-name="Footer" font-size="8pt">
				<fo:block><xsl:value-of select="$portfolio_code"/> - <xsl:value-of select="$asmNode_label"/></fo:block>
				<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
			</fo:static-content>
			<fo:flow flow-name="Content" font-size="10pt">
				<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt">
					<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
				</fo:block>
				<xsl:apply-templates select="./asmUnitStructure | asmContext">
					<xsl:with-param name="size">12pt</xsl:with-param>
				</xsl:apply-templates>
			</fo:flow>
		</fo:page-sequence>
	</xsl:if>
	<xsl:apply-templates select="./asmStructure[not(metadata-wad/@display='N')]|asmUnit[not(metadata-wad/@display='N')]"/>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmUnit ================ -->
<!-- =================================== -->
<xsl:template match="asmUnit">
	<xsl:variable name="asmNode_label"><xsl:value-of select="../asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
	<fo:page-sequence master-reference="default-sequence" id="{generate-id(.)}">
		<fo:static-content flow-name="Footer" font-size="8pt">
			<fo:block><xsl:value-of select="$portfolio_code"/> - <xsl:value-of select="$asmNode_label"/></fo:block>
			<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
		</fo:static-content>
		<fo:flow flow-name="Content" font-size="9pt">
			<xsl:if test="position()=1">
			<xsl:variable name="parent_label"><xsl:value-of select="../../asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
					<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt">
						<xsl:value-of select="$parent_label"/>
					</fo:block>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="contains(metadata/@semantictag,'welcome-unit')">
					<xsl:call-template name="welcomeUnit"/>
				</xsl:when>
				<xsl:otherwise>
					<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt">
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
					<!--
					<xsl:apply-templates select="asmUnitStructure | asmContext">
						<xsl:with-param name="size">12pt</xsl:with-param>
					</xsl:apply-templates>
					-->
					<xsl:for-each select="asmUnit[not(metadata-wad/@display='N')]|asmUnitStructure[not(metadata-wad/@display='N')]|asmContext[not(metadata-wad/@display='N')]">
						<xsl:choose>
							<xsl:when test="local-name()='asmUnit'">
								<xsl:call-template name="processUnit">
								</xsl:call-template>
							</xsl:when>
							<xsl:when test="local-name()='asmUnitStructure'">
								<fo:block>
									<xsl:apply-templates select=".">
										<xsl:with-param name="size">12pt</xsl:with-param>
									</xsl:apply-templates>
								</fo:block>
							</xsl:when>
							<xsl:when test="local-name()='asmContext'">
								<xsl:apply-templates select=".">
									<xsl:with-param name="size">12pt</xsl:with-param>
								</xsl:apply-templates>
							</xsl:when>
							<xsl:otherwise>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</xsl:otherwise>
			</xsl:choose>
		</fo:flow>
	</fo:page-sequence>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmUnitStructure ======= -->
<!-- =================================== -->
<xsl:template match="asmUnitStructure">
	<xsl:param name="size">9pt</xsl:param>
	<xsl:param name="label_style">italic</xsl:param>
	<xsl:param name="space-before">20pt</xsl:param>
	<xsl:param name="margin-left">10pt</xsl:param>
	<xsl:param name="display-type"/>
	<xsl:choose>
		<xsl:when test="contains(metadata/@semantictag,'DocumentBlock')">
			<xsl:call-template name="DocumentBlock">
				<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
			</xsl:call-template>
		</xsl:when>
		<xsl:when test="contains(metadata/@semantictag,'ImageBlock')">
			<xsl:call-template name="ImageBlock">
				<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
			</xsl:call-template>
		</xsl:when>
		<xsl:when test="contains(metadata/@semantictag,'URLBlock')">
			<xsl:call-template name="URLBlock">
				<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:variable name="label"><xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
			<xsl:if test="$label !=''">
				<fo:block font-weight="bold" space-after="5pt">
					<xsl:attribute name="font-size"><xsl:value-of select="$size"/></xsl:attribute>
					<xsl:attribute name="font-style"><xsl:value-of select="$label_style"/></xsl:attribute>
					<xsl:attribute name="space-before"><xsl:value-of select="$space-before"/></xsl:attribute>
					<xsl:value-of select="$label"/>
				</fo:block>
			</xsl:if>
			<xsl:for-each select="asmUnit[not(metadata-wad/@display='N')]|asmUnitStructure[not(metadata-wad/@display='N')]|asmContext[not(metadata-wad/@display='N')]">
				<xsl:choose>
					<xsl:when test="local-name()='asmUnit'">
						<xsl:call-template name="processUnit">
							<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test="local-name()='asmUnitStructure'">
						<fo:block>
							<xsl:attribute name='margin-left'><xsl:value-of select="$margin-left"/></xsl:attribute>
							<xsl:apply-templates select=".">
								<xsl:with-param name="size">9pt</xsl:with-param>
								<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
							</xsl:apply-templates>
						</fo:block>
					</xsl:when>
					<xsl:when test="local-name()='asmContext'">
						<xsl:apply-templates select=".">
							<xsl:with-param name="margin-left"><xsl:value-of select="$margin-left"/></xsl:with-param>
						</xsl:apply-templates>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmContext ============= -->
<!-- =================================== -->

<xsl:template match="asmContext">
	<xsl:param name="margin-left">10pt</xsl:param>
	<xsl:param name="display-type"/>
		<fo:block>
			<xsl:attribute name='margin-left'><xsl:value-of select="$margin-left"/></xsl:attribute>
			<xsl:apply-templates select="asmResource[@xsi_type!='nodeRes' and @xsi_type!='context']">
				<xsl:with-param name="nodeLabel"><xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:with-param>
				<xsl:with-param name="display-type"><xsl:value-of select="$display-type"/></xsl:with-param>
			</xsl:apply-templates>
		</fo:block>
</xsl:template>

<!-- ============= asmResource_Proxy ============= -->
<xsl:template match="asmResource[@xsi_type='Proxy']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>
	<xsl:param name="display-type"/>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="15pt">PROXY</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Dashboard ============= -->
<xsl:template match="asmResource[@xsi_type='Dashboard']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>
	<xsl:param name="display-type"/>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="15pt">Dashboard</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_SendEmail ============= -->
<xsl:template match="asmResource[@xsi_type='SendEmail']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>
	<xsl:param name="display-type"/>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="10pt"><xsl:value-of select="firstname[@lang=$lang]"/></fo:inline>
		<fo:inline padding-left="3pt"><xsl:value-of select="lastname[@lang=$lang]"/></fo:inline>
		<xsl:if test="email[@lang=$lang]!=''">
			<fo:inline padding-left="10pt">
		      <fo:basic-link color="blue">
	            <xsl:attribute name="external-destination">mailto:<xsl:value-of select="email[@lang=$lang]"/></xsl:attribute>
		        <xsl:value-of select="email[@lang=$lang]"/>
		      </fo:basic-link>	
			</fo:inline>
		</xsl:if>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Oembed ============= -->
<xsl:template match="asmResource[@xsi_type='Oembed']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>
	<xsl:param name="display-type"/>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<xsl:if test="url[@lang=$lang]!=''">
			<fo:inline padding-left="10pt">
		      <fo:basic-link color="blue">
	            <xsl:attribute name="external-destination"><xsl:value-of select="url[@lang=$lang]"/></xsl:attribute>
		        <xsl:value-of select="url[@lang=$lang]"/>
		      </fo:basic-link>	
			</fo:inline>
		</xsl:if>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Item ============= -->
<xsl:template match="asmResource[@xsi_type='Item']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<xsl:if test="code!='' and code !='[object HTMLCollection]'">
			<fo:inline>
				<xsl:value-of select="code"/>
			</fo:inline>
			<xsl:if test="value!='' and value !='[object HTMLCollection]'">
				<fo:inline padding-left="3pt">[<xsl:value-of select="value"/>]</fo:inline>
			</xsl:if>
			<fo:inline padding-left="5pt">
				<xsl:apply-templates select="label[@lang=$lang]/node()"/>
			</fo:inline>
		</xsl:if>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_GET_xxx ============= -->
<xsl:template match="asmResource[@xsi_type='Get_Resource' or @xsi_type='Get_Get_Resource']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline padding-left="5pt">
			<xsl:choose>
			   <xsl:when test="label/@lang">
						<xsl:apply-templates select="label[@lang=$lang]/node()"/>
			   </xsl:when>
			   <xsl:otherwise>
						<xsl:apply-templates select="label/node()"/>
			   </xsl:otherwise>
			</xsl:choose>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_GET_xxx ============= -->
<xsl:template match="asmResource[@xsi_type='Get_Double_Resource']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline padding-left="5pt">
			<xsl:choose>
			   <xsl:when test="label1/@lang">
						<xsl:apply-templates select="label1[@lang=$lang]/node()"/>
			   </xsl:when>
			   <xsl:otherwise>
						<xsl:apply-templates select="label1/node()"/>
			   </xsl:otherwise>
			</xsl:choose>
		</fo:inline>
		<fo:inline padding-left="5pt">
			<xsl:choose>
			   <xsl:when test="label2/@lang">
						<xsl:apply-templates select="label2[@lang=$lang]/node()"/>
			   </xsl:when>
			   <xsl:otherwise>
						<xsl:apply-templates select="label2/node()"/>
			   </xsl:otherwise>
			</xsl:choose>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Comments ========= -->
<xsl:template match="asmResource[@xsi_type='Comments']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"/>

	<fo:block font-size="9pt" space-before="10pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="15pt"><xsl:value-of select="author"/></fo:inline>
		<fo:inline padding-left="15pt"><xsl:value-of select="date"/></fo:inline>
	</fo:block>
	<fo:block margin-left="15pt">
		<xsl:apply-templates select="text[@lang=$lang]/node()"/>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Document ========= -->
<!-- ============= asmResource_Audio ========= -->
<!-- ============= asmResource_Video ========= -->
<xsl:template match="asmResource[@xsi_type='Document' or @xsi_type='Audio' or @xsi_type='Video']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>
	<xsl:param name="display-type"/>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline><xsl:value-of select="filename[@lang=$lang]"/></fo:inline>
		<!-- fo:inline padding-left="5pt"> - no hyperlink because no access rights
			<xsl:call-template name="link2file">
				<xsl:with-param name="url0"><xsl:value-of select="$url"/>/resources/resource/file</xsl:with-param>
				<xsl:with-param name="fpath"><xsl:value-of select="./@contextid"/>?lang=<xsl:value-of select="$lang"/></xsl:with-param>
				<xsl:with-param name="str"><xsl:value-of select="filename[@lang=$lang]"/></xsl:with-param>
			</xsl:call-template>
		</fo:inline -->
	</fo:block>

</xsl:template>

<!-- ============= asmResource_Image ============ -->
<xsl:template match="asmResource[@xsi_type='Image']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"/>
	<xsl:param name="width-print"/>
	<xsl:param name="display-type"/>

	<xsl:variable name='src'>
		<xsl:value-of select="$urlimage"/>/resources/resource/file/<xsl:value-of select="./@contextid"/>?lang=<xsl:value-of select="$lang"/>&amp;size=L
	</xsl:variable>
	<xsl:variable name='width'>
		<xsl:choose>
			<xsl:when test="width-print!=''"><xsl:value-of select="$width-print"/></xsl:when>
			<xsl:when test="../metadata-epm/@width/text() and ../metadata-epm/@width!=''"><xsl:value-of select="../metadata-epm/@width"/></xsl:when>
			<xsl:otherwise>100%</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:choose>
		<xsl:when test="$display-type='welcome'">
			<fo:block text-align="center">
			<fo:external-graphic vertical-align="middle" padding-left="5pt" content-width="scale-to-fit" content-height="100%" scaling="uniform">
				<xsl:attribute name="src"><xsl:value-of select="$src"/></xsl:attribute>
				<xsl:attribute name="width"><xsl:value-of select="$width"/></xsl:attribute>
			</fo:external-graphic>
			</fo:block>
		</xsl:when>
		<xsl:otherwise>
			<fo:external-graphic vertical-align="middle" padding-left="5pt" content-width="scale-to-fit" content-height="100%" scaling="uniform">
				<xsl:attribute name="src"><xsl:value-of select="$src"/></xsl:attribute>
				<xsl:attribute name="width"><xsl:value-of select="$width"/></xsl:attribute>
			</fo:external-graphic>
			<fo:block font-size="9pt" space-before="3pt" space-after="5pt">
				<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
				<fo:inline padding-left="5pt"><xsl:value-of select="filename[@lang=$lang]"/></fo:inline>
			</fo:block>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- ============= asmResource_Color ============= -->
<xsl:template match="asmResource[@xsi_type='Color']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="5pt"><xsl:value-of select="text[@lang=$lang]"/></fo:inline>
		<fo:inline padding-left="5pt">
			<fo:instream-foreign-object xmlns:svg="http://www.w3.org/2000/svg">
				<svg:svg width="15" height="15">
				<svg:g>
					<xsl:attribute name="style">fill:<xsl:value-of select="text[@lang=$lang]"/>; stroke:#000000</xsl:attribute>
					<svg:rect x="0" y="5" width="10" height="10"/>
				</svg:g>
				</svg:svg>
			</fo:instream-foreign-object>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_URL2Unit ============= -->
<xsl:template match="asmResource[@xsi_type='URL2Unit']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="5pt">
			<xsl:call-template name="link2file">
				<xsl:with-param name="url0"><xsl:value-of select="$url-appli"/></xsl:with-param>
				<xsl:with-param name="fpath">karuta/htm/page.htm?id=<xsl:value-of select="uuid"/>&amp;type=standard&amp;lang=<xsl:value-of select="$lang"/></xsl:with-param>
				<xsl:with-param name="str"><xsl:value-of select="label[@lang=$lang]"/></xsl:with-param>
			</xsl:call-template>
		</fo:inline>
	</fo:block>

</xsl:template>

<!-- ============= asmResource_Field ============= -->
<xsl:template match="asmResource[@xsi_type='Field']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="0pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline padding-left="5pt">
			<xsl:apply-templates select="text[@lang=$lang]/node()"/>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Calendar ========= -->
<xsl:template match="asmResource[@xsi_type='Calendar']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="0pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline padding-left="5pt">
			<xsl:apply-templates select="text[@lang=$lang]/node()"/>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_TextField ======== -->
<xsl:template match="asmResource[@xsi_type='TextField']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" font-weight="bold" space-before="0pt" space-after="5pt">
		<xsl:value-of select="$nodeLabel"/>
	</fo:block>
	<fo:block>
		<xsl:apply-templates select="text[@lang=$lang]/node()"/>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_URL ============== -->
<xsl:template match="asmResource[@xsi_type='URL' or @gm_type='URL']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="10pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="5pt">
			<xsl:call-template name="linkpdf">
				<xsl:with-param name="href"><xsl:value-of select="url[@lang=$lang]"/></xsl:with-param>
				<xsl:with-param name="str"><xsl:value-of select="label[@lang=$lang]"/></xsl:with-param>
			</xsl:call-template>
		</fo:inline>
	</fo:block>
	<xsl:if test="../asmResource[@xsi_type='context']/comment/text() and ../asmResource[@xsi_type='context']/comment!=''">
		<fo:block margin-left="15pt">
			<xsl:apply-templates select="../asmResource[@xsi_type='context']/comment/node()"/>
		</fo:block>
	</xsl:if>
</xsl:template>

<!-- ============= asmResource_FormInput ============= -->
<xsl:template match="asmResource[@xsi_type='FormInput' or @gm_type='FormInput']">
	<xsl:param name="nodeLabel"></xsl:param>

		<xsl:variable name="value">
			<xsl:choose>
				<xsl:when test="../instance/data/*[position()=1]!=''">
					<xsl:value-of select="../instance/data/*[position()=1]"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="*[position()=1]/@value"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
	<fo:block font-size="9pt" space-before="10pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/> </fo:inline>
		</xsl:if>
		<fo:inline padding-left="3pt"><xsl:value-of select="$value"/></fo:inline>
	</fo:block>
</xsl:template>
<!-- ============= asmResource_FormTextarea ============= -->
<xsl:template match="asmResource[@xsi_type='FormTextarea' or @gm_type='FormTextarea']">
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="9pt" space-before="10pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/> </fo:inline>
		</xsl:if>
	</fo:block>
	<fo:block font-size="9pt" space-before="0pt" space-after="5pt" margin-left="15pt">
		<xsl:apply-templates select="../instance/data/*[position()=1]/node()"/>
	</fo:block>
</xsl:template>
<!-- ============= asmResource_FormCheckboxButton ============= -->
<xsl:template match="asmResource[@xsi_type='FormRadioButton' or @gm_type='FormRadioButton']">
	<xsl:param name="nodeLabel"></xsl:param>

		<xsl:variable name="checkedVal"><xsl:value-of select="../instance/data/*[position()=1]"/></xsl:variable>
	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="*[position()=1]/label"/> </fo:inline>
		<xsl:for-each select=".//item">
			<xsl:if test="contains($checkedVal, value)">
				<fo:inline padding-left="3pt"><xsl:value-of select="label"/></fo:inline>
			</xsl:if>
		</xsl:for-each>
	</fo:block>
</xsl:template>
<!-- ============= asmResource_FormRadioButton ============= -->
<xsl:template match="asmResource[@xsi_type='FormCheckboxButton' or @gm_type='FormCheckboxButton']">
	<xsl:param name="nodeLabel"></xsl:param>

		<xsl:variable name="checkedVal"><xsl:value-of select="../instance/data/*[position()=1]"/></xsl:variable>
	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="*[position()=1]/label"/> </fo:inline>
		<xsl:for-each select=".//item[contains($checkedVal, value)]">
			<xsl:if test="position()&gt;=2">
				<fo:inline>, </fo:inline>
			</xsl:if>
			<fo:inline padding-left="3pt"><xsl:value-of select="label"/></fo:inline>
		</xsl:for-each>
	</fo:block>
</xsl:template>
<!-- ============= asmResource_FormSelect ============= -->
<xsl:template match="asmResource[@xsi_type='FormSelect' or @gm_type='FormSelect']">
	<xsl:param name="nodeLabel"></xsl:param>

		<xsl:variable name="checkedVal"><xsl:value-of select="../instance/data/*[position()=1]"/></xsl:variable>
	<fo:block font-size="9pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="*[position()=1]/label"/> </fo:inline>
		<xsl:for-each select=".//item[contains($checkedVal, value)]">
			<xsl:if test="position()&gt;=2">
				<fo:inline>, </fo:inline>
			</xsl:if>
			<fo:inline padding-left="3pt"><xsl:value-of select="label"/></fo:inline>
		</xsl:for-each>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Form ============= -->
  <xsl:template match="asmResource[@xsi_type='XForm' or @gm_type='XForm']">
	<xsl:param name="nodeLabel"></xsl:param>

		<fo:block font-size="9pt" space-before="10pt" space-after="5pt">
	    <xsl:apply-templates select="xforms/inputs/*"/>
		</fo:block>
</xsl:template>
<!-- =========================================================================-->
<xsl:template match="input">
  <xsl:variable name="ref"><xsl:value-of select="@ref"/></xsl:variable>
  <xsl:variable name="value"><xsl:for-each select="../../../..//*"><xsl:if test="local-name(.)=$ref"><xsl:value-of select="."/></xsl:if></xsl:for-each></xsl:variable>

	<fo:block font-size="9pt" space-before="0pt" space-after="5pt">
		<fo:inline><xsl:value-of select="label"/> </fo:inline>
		<fo:inline padding-left="3pt"><xsl:value-of select="$value"/></fo:inline>
	</fo:block>
</xsl:template>
<!-- =========================================================================-->
<xsl:template match="textarea">
  <xsl:variable name="ref"><xsl:value-of select="@ref"/></xsl:variable>
  
	<fo:block font-size="9pt" space-before="0pt" space-after="5pt">
		<fo:inline><xsl:value-of select="label"/> </fo:inline>
	</fo:block>
	<fo:block font-size="9pt" space-before="0pt" space-after="5pt" margin-left="15pt">
		<xsl:for-each select="../../../..//*">
			<xsl:if test="local-name(.)=$ref">
				<xsl:apply-templates select="./node()"/>
			</xsl:if>
		</xsl:for-each>
	</fo:block>
</xsl:template>
<!-- =================================================== -->
<xsl:template match="select|select1">
	<xsl:variable name="ref"><xsl:value-of select="@ref"/></xsl:variable>
	<xsl:variable name="name"><xsl:value-of select="local-name(.)"/></xsl:variable>
	<xsl:variable name="checkedVal"><xsl:for-each select="../../../..//*"><xsl:if test="local-name(.)=$ref"><xsl:value-of select="."/></xsl:if></xsl:for-each></xsl:variable>

	<xsl:variable name="imgSelect">
			<xsl:choose>
				<xsl:when test="$name = 'select'">checkbox</xsl:when>
				<xsl:otherwise>radio</xsl:otherwise>
			</xsl:choose>
	</xsl:variable>

	<fo:block font-size="9pt" space-before="0pt" space-after="5pt">
		<fo:inline><xsl:value-of select="label"/> </fo:inline>
	</fo:block>
	<xsl:for-each select=".//item">
		<xsl:variable name="val"><xsl:value-of select="value"/></xsl:variable>
		<fo:block font-size="9pt" space-before="0pt" space-after="5pt" margin-left="15pt">
			<xsl:choose>
				<xsl:when test="contains($checkedVal, $val)">
					<fo:external-graphic content-height="8pt" vertical-align="middle" padding-left="5pt">
						<xsl:attribute name="src"><xsl:value-of select="$ppath"/>jsp/img/<xsl:value-of select="$imgSelect"/>-checked.gif</xsl:attribute>
					</fo:external-graphic>
				</xsl:when>
				<xsl:otherwise>
					<fo:external-graphic content-height="8pt" vertical-align="middle" padding-left="5pt">
						<xsl:attribute name="src"><xsl:value-of select="$ppath"/>jsp/img/<xsl:value-of select="$imgSelect"/>-unchecked.gif</xsl:attribute>
					</fo:external-graphic>
				</xsl:otherwise>
			</xsl:choose>
			<fo:inline><xsl:value-of select="label"/></fo:inline>
		</fo:block>
	</xsl:for-each>

</xsl:template>
  
<!-- =================================================== -->
<!-- =================================================== -->
<!-- =================================================== -->

<xsl:template name="linkpdf">
	<xsl:param name="href"/>
	<xsl:param name="str"/>
      <fo:basic-link color="blue" text-decoration="underline">
        <xsl:choose>
          <xsl:when test="starts-with($href, '#')">
            <xsl:attribute name="internal-destination">
              <xsl:value-of select="substring($href, 2)"/>
            </xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="external-destination">
		         <xsl:choose>
		          <xsl:when test="$href!=''">
		              <xsl:value-of select="$href"/>
		          </xsl:when>
		          <xsl:otherwise><xsl:text> </xsl:text></xsl:otherwise>
		        </xsl:choose>
            </xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:value-of select="$str"/>
      </fo:basic-link>
</xsl:template>

<xsl:template name="link2file">
	<xsl:param name="url0"/>
	<xsl:param name="fpath"/>
	<xsl:param name="str"/>

	<xsl:variable name="href">
			<xsl:call-template name="hrefOffile">
				 <xsl:with-param name="url0" select="$url0" />
				 <xsl:with-param name="fpath" select="$fpath" />
			</xsl:call-template>
	</xsl:variable>
	<xsl:call-template name="linkpdf">
		 <xsl:with-param name="href" select="$href" />
		 <xsl:with-param name="str" select="$str" />
	</xsl:call-template>

</xsl:template>

<xsl:template name="hrefOffile">
   <xsl:param name="url0" />
   <xsl:param name="fpath" />

	<xsl:variable name="char">../</xsl:variable>
   <xsl:choose>
      <xsl:when test="contains($fpath, $char)">
         <xsl:call-template name="hrefOffile">
            <xsl:with-param name="url0" select="$url0" />
            <xsl:with-param name="fpath" select="substring-after($fpath, $char)" />
         </xsl:call-template>
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$url0"/>/<xsl:value-of select="$fpath"/></xsl:otherwise>
   </xsl:choose>
</xsl:template>

<!-- =================================== -->
<xsl:template name="welcome_page">
<!-- =================================== -->
	<xsl:apply-templates select="./asmUnit[contains(metadata/@semantictag,'welcome-unit')]"/>
</xsl:template>

<!-- =================================== -->
<xsl:template name="processUnit">
<!-- =================================== -->
	<xsl:param name="space-before">0pt</xsl:param>
	<xsl:choose>
		<xsl:when test="contains(metadata/@semantictag,'welcome-unit')">
			<xsl:call-template name="welcomeUnit"/>
		</xsl:when>
		<xsl:otherwise>
			<fo:block font-size="12pt" font-style="italic" font-weight="bold" space-before="20pt" space-after="5pt">
				<xsl:value-of select="./asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
			</fo:block>
			<fo:block space-before="0pt" space-after="15pt">
				<xsl:apply-templates select="./*">
					<xsl:with-param name="size">12pt</xsl:with-param>
					<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
				</xsl:apply-templates>
			</fo:block>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- =================================== -->
<xsl:template name="welcomeUnit">
	<xsl:param name="space-before">0pt</xsl:param>
<!-- =================================== -->
	<xsl:if test="./asmUnitStructure[metadata/@semantictag='welcome-page']">
		<xsl:variable name='wnode' select="(./asmUnitStructure[metadata/@semantictag='welcome-page'])"/>
		<xsl:if test="$wnode/asmContext[metadata/@semantictag='welcome-main-image']">
			<xsl:variable name='inode' select="($wnode/asmContext[metadata/@semantictag='welcome-main-image'])"/>
			<xsl:variable name='src'>
				<xsl:value-of select="$urlimage"/>/resources/resource/file/<xsl:value-of select="$inode/asmResource[@xsi_type='Image']/@contextid"/>?lang=<xsl:value-of select="$lang"/>&amp;size=L
			</xsl:variable>
			<xsl:variable name='width'>
				<xsl:choose>
					<xsl:when test="$inode/metadata-epm/@width/text() and $inode/metadata-epm/@width!=''"><xsl:value-of select="$inode/metadata-epm/@width"/></xsl:when>
					<xsl:otherwise>100%</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name='height'>
				<xsl:choose>
					<xsl:when test="$inode/metadata-epm/@width/text() and $inode/metadata-epm/@width!=''"><xsl:value-of select="$inode/metadata-epm/@width"/></xsl:when>
					<xsl:otherwise>250px</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:variable name='tnode' select="($wnode/asmContext[metadata/@semantictag='welcome-title'])"/>
			<xsl:variable name='bnode' select="($wnode/asmContext[metadata/@semantictag='welcome-baseline'])"/>
			
			<fo:block-container text-align="center" space-before="5pt" space-after="5pt" background-repeat="repeat" background-position="center" content-width="scale-to-fit" scaling="uniform">
				<xsl:attribute name="background-image"><xsl:value-of select="$src"/></xsl:attribute>
				<xsl:attribute name="width"><xsl:value-of select="$width"/></xsl:attribute>
				<xsl:attribute name="content-height"><xsl:value-of select="$height"/></xsl:attribute>
				<xsl:attribute name="height"><xsl:value-of select="$height"/></xsl:attribute>
				<fo:block-container display-align="center" border-color="black" border-style="solid" border-width="0pt" background-color="transparent" width="100%" height="100%">
				<fo:block border-color="#ffffff" border-style="solid" border-width="0pt" background-color="transparent" text-align="center" font-weight="bold" font-size="20pt" space-before="5pt" space-after="5pt" width="60%">
					<fo:block background-color="transparent" color="gray"><xsl:value-of select="$tnode/asmResource[@xsi_type!='nodeRes' and @xsi_type!='context']/text[@lang=$lang]"/></fo:block>
					<fo:leader color="gray" leader-pattern="rule" leader-length="50%" rule-style="solid" rule-thickness="2pt"/>
					<fo:block color="black" font-size="15pt" space-before="5pt" space-after="5pt">
						<fo:inline><xsl:value-of select="$bnode/asmResource[@xsi_type!='nodeRes' and @xsi_type!='context']/text[@lang=$lang]"/></fo:inline>
					</fo:block>
				</fo:block>
				</fo:block-container>
			</fo:block-container>
		</xsl:if>

		<xsl:for-each select="$wnode/asmUnitStructure[metadata/@semantictag='welcome-block' or contains(metadata/@semantictag,'asm-block')]">
			<xsl:choose>
				<xsl:when test="metadata/@semantictag='welcome-block'">
					<xsl:call-template name="welcome_block">
						<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<fo:block>
						<xsl:apply-templates select=".">
							<xsl:with-param name="size">12pt</xsl:with-param>
						</xsl:apply-templates>
					</fo:block>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:if>
</xsl:template>

<xsl:template name="welcome_block">
	<xsl:param name="space-before">0pt</xsl:param>
	<xsl:param name="label-align">center</xsl:param>
<!-- ============================================ -->
	<xsl:variable name="label"><xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
	<xsl:if test="$label !=''">
		<xsl:variable name='size'>
			<xsl:choose>
				<xsl:when test="metadata-epm/@font-size/text() and metadata-epm/@font-size!=''"><xsl:value-of select="metadata-epm/@font-size"/></xsl:when>
				<xsl:otherwise>12pt</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name='font-weight'>
			<xsl:choose>
				<xsl:when test="metadata-epm/@font-weight/text() and metadata-epm/@font-weight!=''"><xsl:value-of select="metadata-epm/@font-weight"/></xsl:when>
				<xsl:otherwise>normal</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name='font-style'>
			<xsl:choose>
				<xsl:when test="metadata-epm/@font-style/text() and metadata-epm/@font-style!=''"><xsl:value-of select="metadata-epm/@font-style"/></xsl:when>
				<xsl:otherwise>normal</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name='text-align'>
			<xsl:choose>
				<xsl:when test="metadata-epm/@text-align/text() and metadata-epm/@text-align!=''"><xsl:value-of select="metadata-epm/@text-align"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="$label-align"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<fo:block space-after="5pt">
			<xsl:attribute name="font-size"><xsl:value-of select="$size"/></xsl:attribute>
			<xsl:attribute name="font-weight"><xsl:value-of select="$font-weight"/></xsl:attribute>
			<xsl:attribute name="font-style"><xsl:value-of select="$font-style"/></xsl:attribute>
			<xsl:attribute name="text-align"><xsl:value-of select="$text-align"/></xsl:attribute>
			<xsl:attribute name="space-before"><xsl:value-of select="$space-before"/></xsl:attribute>
			<xsl:value-of select="$label"/>
		</fo:block>
	</xsl:if>
	<xsl:for-each select="asmContext[contains(metadata/@semantictag,'welcome')]">
		<xsl:apply-templates select=".">
			<xsl:with-param name="size">12pt</xsl:with-param>
			<xsl:with-param name="display-type">welcome</xsl:with-param>
		</xsl:apply-templates>
	</xsl:for-each>
	<xsl:variable name='nb_blocks' select="count(./asmUnitStructure[metadata/@semantictag='welcome-block'])"/>
	<xsl:if test="$nb_blocks &gt; 0">
		<fo:table font-size="10pt" >
            <fo:table-body>
		        <fo:table-row>
			 	<xsl:for-each select="asmUnitStructure[metadata/@semantictag='welcome-block']">
			        <fo:table-cell border="solid white 0px" padding="2px">
			            <fo:block>
						<xsl:call-template name="welcome_block">
							<xsl:with-param name="space-before"><xsl:value-of select="$space-before"/></xsl:with-param>
						</xsl:call-template>
						</fo:block>
			        </fo:table-cell>
				</xsl:for-each>
		        </fo:table-row>
            </fo:table-body>
        </fo:table>
	</xsl:if>
</xsl:template>

<!-- =================================== -->
<xsl:template name="DocumentBlock">
<!-- =================================== -->
	<xsl:param name="space-before">0pt</xsl:param>
	
</xsl:template>

<!-- =================================== -->
<xsl:template name="ImageBlock">
<!-- =================================== -->
	<xsl:param name="space-before">0pt</xsl:param>
	
</xsl:template>

<!-- =================================== -->
<xsl:template name="URLBlock">
<!-- =================================== -->
	<xsl:param name="space-before">0pt</xsl:param>
	
</xsl:template>

</xsl:stylesheet>