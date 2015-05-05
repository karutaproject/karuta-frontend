<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:fo="http://www.w3.org/1999/XSL/Format"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  
<!-- =========================================================================-->
<!-- =========================================================================-->
<!-- =========================================================================-->

<!-- =====================================-->
<xsl:template match="span">
<!-- =====================================-->
	<xsl:variable name='style'><xsl:value-of select="@style"/></xsl:variable>
	<fo:inline>
		<xsl:if test="contains($style, 'font-weight')">
			<xsl:attribute name="font-weight">
				<xsl:call-template name="lastIndexOfAB">
					 <xsl:with-param name="string" select="$style" />
					 <xsl:with-param name="a">font-weight: </xsl:with-param>
					 <xsl:with-param name="b">;</xsl:with-param>
				</xsl:call-template>
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
<xsl:template match="div">
<!-- =====================================-->
	<fo:block space-before="5pt" space-after="5pt">
		<xsl:apply-templates select="*|text()"/>
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
<xsl:template match="table">
<!-- =====================================-->
	<fo:table width="100%">
		<fo:table-body>
			<xsl:apply-templates select="*"/>
		</fo:table-body>
	</fo:table>
</xsl:template>

<!-- =====================================-->
<xsl:template match="tr">
<!-- =====================================-->
	<fo:table-row>
			<xsl:apply-templates select="*"/>
	</fo:table-row>
</xsl:template>

<!-- =====================================-->
<xsl:template match="td">
<!-- =====================================-->
	<fo:table-cell border="1px solid gray" padding="2px">
		<fo:block>
			<xsl:apply-templates select="*"/>
		</fo:block>
	</fo:table-cell>
</xsl:template>

</xsl:stylesheet>