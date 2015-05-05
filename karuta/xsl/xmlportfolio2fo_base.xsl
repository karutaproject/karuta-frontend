<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

<xsl:include href="html2fo_base.xsl"/>

<!-- =================================== -->
<xsl:template name="tree">
<!-- =================================== -->
	<fo:page-sequence master-reference="default-sequence">
		<fo:static-content flow-name="Footer" font-size="9pt">
			<fo:block><xsl:value-of select="/portfolio/asmRoot/asmResource[@xsi_type='nodeRes']/code"/></fo:block>
			<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
		</fo:static-content>
		<fo:flow flow-name="Content" font-size="10pt">
			<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="0pt" text-align="center">
				<xsl:value-of select="/portfolio/asmRoot/asmResource[@xsi_type='nodeRes']/code"/>
			</fo:block>
			<xsl:for-each select="/portfolio/asmRoot/asmStructure[not(metadata-wad/@displaytree='none')]">
					<fo:block font-size="11pt" font-weight="bold" space-before="24pt" space-after="0pt" background-color="lightgrey">
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
					<fo:block margin-left="10pt">
						<xsl:for-each select="asmStructure[not(metadata-wad/@displaytree='none')]|asmUnit[not(metadata-wad/@displaytree='none')]">
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
	<fo:block font-size="11pt" font-style="italic" space-before="5pt" space-after="5pt" background-color="lightgrey">
		<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
	</fo:block>
	<fo:block margin-left="10pt">
		<xsl:for-each select="asmStructure|asmUnit">
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
		<xsl:if test="asmUnitStructure | asmContext">
			<fo:page-sequence master-reference="default-sequence" id="{generate-id(.)}">
				<fo:static-content flow-name="Footer" font-size="9pt">
					<fo:block><xsl:value-of select="/portfolio/asmRoot/asmResource[@xsi_type='nodeRes']/code"/> - <xsl:value-of select="$asmNode_label"/></fo:block>
					<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
				</fo:static-content>
				<fo:flow flow-name="Content" font-size="10pt">
					<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt" background-color="lightgrey">
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
					<xsl:apply-templates select="asmUnitStructure | asmContext">
						<xsl:with-param name="size">12pt</xsl:with-param>
					</xsl:apply-templates>
				</fo:flow>
			</fo:page-sequence>
		</xsl:if>
		<xsl:apply-templates select="./asmStructure[not(metadata-wad/@displaytree='none')]"/>
		<xsl:apply-templates select="./asmUnit[not(metadata-wad/@displaytree='none')]"/>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmStructure =========== -->
<!-- =================================== -->
<xsl:template match="asmStructure">
		<xsl:variable name="asmNode_label"><xsl:value-of select="../asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
		<xsl:if test="asmUnitStructure | asmContext">
			<fo:page-sequence master-reference="default-sequence" id="{generate-id(.)}">
				<fo:static-content flow-name="Footer" font-size="9pt">
					<fo:block><xsl:value-of select="/portfolio/asmRoot/asmResource[@xsi_type='nodeRes']/code"/> - <xsl:value-of select="$asmNode_label"/></fo:block>
					<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
				</fo:static-content>
				<fo:flow flow-name="Content" font-size="10pt">
					<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt" background-color="lightgrey">
						<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
					</fo:block>
					<xsl:apply-templates select="asmUnitStructure | asmContext">
						<xsl:with-param name="size">12pt</xsl:with-param>
					</xsl:apply-templates>
				</fo:flow>
			</fo:page-sequence>
		</xsl:if>
		<xsl:apply-templates select="./asmStructure[not(metadata-wad/@displaytree='none')]"/>
		<xsl:apply-templates select="./asmUnit[not(metadata-wad/@displaytree='none')]"/>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmUnit ================ -->
<!-- =================================== -->
<xsl:template match="asmUnit">
		<xsl:variable name="asmNode_label"><xsl:value-of select="../asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
		<fo:page-sequence master-reference="default-sequence" id="{generate-id(.)}">
			<fo:static-content flow-name="Footer" font-size="9pt">
				<fo:block><xsl:value-of select="/portfolio/asmRoot/asmResource[@xsi_type='nodeRes']/code"/> - <xsl:value-of select="$asmNode_label"/></fo:block>
				<fo:block text-align="right" margin-top="-10pt">- <fo:page-number/> - <xsl:value-of select="/portfolio/asmRoot/date"/></fo:block>
			</fo:static-content>
			<fo:flow flow-name="Content" font-size="10pt">
				<fo:block font-size="14pt" font-weight="bold" space-before="24pt" space-after="5pt" background-color="lightgrey">
					<xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/>
				</fo:block>
				<xsl:apply-templates select="asmUnitStructure | asmContext">
					<xsl:with-param name="size">12pt</xsl:with-param>
				</xsl:apply-templates>
			</fo:flow>
		</fo:page-sequence>
</xsl:template>

<!-- =================================== -->
<!-- ========== asmUnitStructure ======= -->
<!-- =================================== -->
<xsl:template match="asmUnitStructure">
	<xsl:param name="size">10pt</xsl:param>
	<xsl:param name="label_style">italic</xsl:param>
	<xsl:param name="space-before">15pt</xsl:param>
	<xsl:param name="margin-left">10pt</xsl:param>
	<xsl:variable name="label"><xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:variable>
		<xsl:if test="$label !=''">
			<fo:block font-weight="bold" space-after="0pt">
				<xsl:attribute name="font-size"><xsl:value-of select="$size"/></xsl:attribute>
				<xsl:attribute name="font-style"><xsl:value-of select="$label_style"/></xsl:attribute>
				<xsl:attribute name="space-before"><xsl:value-of select="$space-before"/></xsl:attribute>
				<xsl:value-of select="$label"/>
			</fo:block>
		</xsl:if>
		<xsl:for-each select="asmUnitStructure|asmContext">
			<xsl:choose>
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
</xsl:template>

<!-- =================================== -->
<!-- ========== asmContext ============= -->
<!-- =================================== -->

<xsl:template match="asmContext">
	<xsl:param name="margin-left">10pt</xsl:param>
		<fo:block>
			<xsl:attribute name='margin-left'><xsl:value-of select="$margin-left"/></xsl:attribute>
			<xsl:apply-templates select="asmResource[@xsi_type!='nodeRes' and @xsi_type!='context']">
				<xsl:with-param name="nodeLabel"><xsl:value-of select="asmResource[@xsi_type='nodeRes']/label[@lang=$lang]"/></xsl:with-param>
			</xsl:apply-templates>
		</fo:block>
</xsl:template>

<!-- ============= asmResource_Proxy ============= -->
<xsl:template match="asmResource[@xsi_type='Proxy']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
			<fo:inline>PROXY</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Item ============= -->
<xsl:template match="asmResource[@xsi_type='Item']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
		<xsl:if test="code!='' and code !='[object HTMLCollection]'">
			<fo:inline>
				<xsl:value-of select="code"/>
			</fo:inline>
			<fo:inline>.</fo:inline>
			<fo:inline>
				<xsl:apply-templates select="label[@lang=$lang]/node()"/>
			</fo:inline>
		</xsl:if>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_GET_xxx ============= -->
<xsl:template match="asmResource[@xsi_type='Get_Resource' or @xsi_type='Get_Get_Resource']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline>
			<xsl:if test="$nodeLabel!=''">
				<xsl:attribute name='padding-left'>3pt</xsl:attribute>
			</xsl:if>
			<xsl:if test="code!='' and code !='[object HTMLCollection]' and code !='undefined'">
				<xsl:if test="rank!='' and rank !='undefined'">
					<fo:inline><xsl:value-of select="rank"/>.</fo:inline>
				</xsl:if>
				<fo:inline>
					<xsl:choose>
					   <xsl:when test="label/@lang">
								<xsl:apply-templates select="label[@lang=$lang]/node()"/>
					   </xsl:when>
					   <xsl:otherwise>
								<xsl:apply-templates select="label/node()"/>
					   </xsl:otherwise>
					</xsl:choose>
				</fo:inline>
			</xsl:if>
		</fo:inline>
	</fo:block>
	<xsl:if test="../asmResource[@xsi_type='context']/comment/text() and ../asmResource[@xsi_type='context']/comment!=''">
		<fo:block margin-left="15pt">
			<xsl:apply-templates select="../asmResource[@xsi_type='context']/comment/node()"/>
		</fo:block>
	</xsl:if>
</xsl:template>


<!-- ============= asmResource_Comments ========= -->
<xsl:template match="asmResource[@xsi_type='Comments']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"/>

	<fo:block font-size="10pt" space-before="10pt" space-after="5pt">
		<fo:inline><xsl:value-of select="author"/></fo:inline>
		<fo:inline padding-left="15pt"><xsl:value-of select="date"/></fo:inline>
	</fo:block>
	<fo:block margin-left="15pt">
		<xsl:apply-templates select="text/node()"/>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Document ========= -->
<xsl:template match="asmResource[@xsi_type='Document']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<xsl:variable name='file'>
		<xsl:call-template name="lastIndexOf">
			 <xsl:with-param name="string" select="identifier"/>
			 <xsl:with-param name="char">/</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name='filenamePublished'>
		<xsl:call-template name="replace">
			<xsl:with-param name="ptext" select="identifier"/>
			<xsl:with-param name="ppattern">uploadDocs</xsl:with-param>
			<xsl:with-param name="preplacement">Docs</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name='href'>
		<xsl:choose>
			<xsl:when test="$publish='1'"><xsl:value-of select="$filenamePublished"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="identifier"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="url0">
		<xsl:call-template name="str2lastIndex">
			 <xsl:with-param name="string" select="$url" />
			 <xsl:with-param name="char">/</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>

	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="3pt">
			<xsl:call-template name="link2file">
				<xsl:with-param name="url0"><xsl:value-of select="$url"/>/resources/resource/file/<xsl:value-of select="$lang"/></xsl:with-param>
				<xsl:with-param name="fpath"><xsl:value-of select="../@id"/></xsl:with-param>
				<xsl:with-param name="str"><xsl:value-of select="filename[@lang=$lang]"/></xsl:with-param>
			</xsl:call-template>
		</fo:inline>
	</fo:block>

	<xsl:if test="../asmResource[@xsi_type='context']/comment/text() and ../asmResource[@xsi_type='context']/comment!=''">
		<fo:block margin-left="15pt">
			<xsl:apply-templates select="../asmResource[@xsi_type='context']/comment/node()"/>
		</fo:block>
	</xsl:if>
</xsl:template>

<!-- ============= asmResource_Image ============ -->
<xsl:template match="asmResource[@xsi_type='Image']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"/>
	<xsl:param name="width-print"/>

	<xsl:variable name='src'>
		<xsl:value-of select="$url"/>/resources/resource/file/<xsl:value-of select="../@id"/>?lang=<xsl:value-of select="$lang"/>&amp;size=L
	</xsl:variable>
	<xsl:variable name='width'>
		<xsl:choose>
			<xsl:when test="width-print!=''"><xsl:value-of select="$width-print"/></xsl:when>
			<xsl:when test="width/text() and width!=''"><xsl:value-of select="width"/></xsl:when>
			<xsl:otherwise>100</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<fo:external-graphic vertical-align="middle" padding-left="5pt" content-width="scale-to-fit" content-height="100%" width="100%" scaling="uniform">
		<xsl:attribute name="src"><xsl:value-of select="$src"/></xsl:attribute>
	</fo:external-graphic>
	<fo:block>
		<fo:inline><xsl:value-of select="label"/></fo:inline>
	</fo:block>
	<xsl:if test="../asmResource[@xsi_type='context']/comment/text() and ../asmResource[@xsi_type='context']/comment!=''">
		<fo:block margin-left="15pt">
			<xsl:apply-templates select="../asmResource[@xsi_type='context']/comment/node()"/>
		</fo:block>
	</xsl:if>
</xsl:template>


<!-- ============= asmResource_Field ============= -->
<xsl:template match="asmResource[@xsi_type='Field']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" space-before="0pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline padding-left="3pt">
			<xsl:apply-templates select="text/node()"/>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_Calendar ========= -->
<xsl:template match="asmResource[@xsi_type='Calendar']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" space-before="0pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		</xsl:if>
		<fo:inline padding-left="3pt">
			<xsl:apply-templates select="text/node()"/>
		</fo:inline>
	</fo:block>
</xsl:template>

<!-- ============= asmResource_TextField ======== -->
<xsl:template match="asmResource[@xsi_type='TextField']">
<!-- ============================================ -->
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" font-weight="bold" space-before="0pt" space-after="5pt">
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

	<fo:block font-size="10pt" space-before="10pt" space-after="5pt">
		<fo:inline><xsl:value-of select="$nodeLabel"/></fo:inline>
		<fo:inline padding-left="3pt">
			<xsl:call-template name="linkpdf">
				<xsl:with-param name="href"><xsl:value-of select="url"/></xsl:with-param>
				<xsl:with-param name="str"><xsl:value-of select="label"/></xsl:with-param>
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
	<fo:block font-size="10pt" space-before="10pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/> </fo:inline>
		</xsl:if>
		<fo:inline padding-left="3pt"><xsl:value-of select="$value"/></fo:inline>
	</fo:block>
</xsl:template>
<!-- ============= asmResource_FormTextarea ============= -->
<xsl:template match="asmResource[@xsi_type='FormTextarea' or @gm_type='FormTextarea']">
	<xsl:param name="nodeLabel"></xsl:param>

	<fo:block font-size="10pt" space-before="10pt" space-after="5pt">
		<xsl:if test="$nodeLabel!=''">
			<fo:inline><xsl:value-of select="$nodeLabel"/> </fo:inline>
		</xsl:if>
	</fo:block>
	<fo:block font-size="10pt" space-before="0pt" space-after="5pt" margin-left="15pt">
		<xsl:apply-templates select="../instance/data/*[position()=1]/node()"/>
	</fo:block>
</xsl:template>
<!-- ============= asmResource_FormCheckboxButton ============= -->
<xsl:template match="asmResource[@xsi_type='FormRadioButton' or @gm_type='FormRadioButton']">
	<xsl:param name="nodeLabel"></xsl:param>

		<xsl:variable name="checkedVal"><xsl:value-of select="../instance/data/*[position()=1]"/></xsl:variable>
	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
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
	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
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
	<fo:block font-size="10pt" space-before="5pt" space-after="5pt">
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

		<fo:block font-size="10pt" space-before="10pt" space-after="5pt">
	    <xsl:apply-templates select="xforms/inputs/*"/>
		</fo:block>
</xsl:template>
<!-- =========================================================================-->
<xsl:template match="input">
  <xsl:variable name="ref"><xsl:value-of select="@ref"/></xsl:variable>
  <xsl:variable name="value"><xsl:for-each select="../../../..//*"><xsl:if test="local-name(.)=$ref"><xsl:value-of select="."/></xsl:if></xsl:for-each></xsl:variable>

	<fo:block font-size="10pt" space-before="0pt" space-after="5pt">
		<fo:inline><xsl:value-of select="label"/> </fo:inline>
		<fo:inline padding-left="3pt"><xsl:value-of select="$value"/></fo:inline>
	</fo:block>
</xsl:template>
<!-- =========================================================================-->
<xsl:template match="textarea">
  <xsl:variable name="ref"><xsl:value-of select="@ref"/></xsl:variable>
  
	<fo:block font-size="10pt" space-before="0pt" space-after="5pt">
		<fo:inline><xsl:value-of select="label"/> </fo:inline>
	</fo:block>
	<fo:block font-size="10pt" space-before="0pt" space-after="5pt" margin-left="15pt">
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

	<fo:block font-size="10pt" space-before="0pt" space-after="5pt">
		<fo:inline><xsl:value-of select="label"/> </fo:inline>
	</fo:block>
	<xsl:for-each select=".//item">
		<xsl:variable name="val"><xsl:value-of select="value"/></xsl:variable>
		<fo:block font-size="10pt" space-before="0pt" space-after="5pt" margin-left="15pt">
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
	
</xsl:stylesheet>