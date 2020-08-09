<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<xsl:output method="xml" />
	<xsl:param name="lang">en</xsl:param>
	<xsl:template match="/">
		<model>
			<xsl:apply-templates select='//asmRoot/asmUnitStructure'/>
		</model>
	</xsl:template>
	<!-- ================ table ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-table']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<table>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</table>
	</xsl:template>
	<!-- ================ row ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-row']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<row>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</row>
	</xsl:template>
	<!-- ================ cell ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-cell']">
		<xsl:variable name="colspan">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='colspan']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<cell>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($colspan='')">
				<xsl:attribute name="colspan"><xsl:value-of select="$colspan"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</cell>
	</xsl:template>
	<!-- ================ refresh ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-refresh']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<refresh>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</refresh>
	</xsl:template>
	<!-- ================ autorefresh ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-autorefresh']">
		<xsl:variable name="delay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='delay']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<autorefresh>
			<xsl:if test="not($delay='')">
				<xsl:attribute name="delay"><xsl:value-of select="$delay"/></xsl:attribute>
			</xsl:if>
		</autorefresh>
	</xsl:template>
	<!-- ================ qrcode ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-qrcode']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<qrcode>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</qrcode>
	</xsl:template>
	<!-- ================ europass ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-europass']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<europass>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</europass>
	</xsl:template>
	<!-- ================ if-then-else ============================ -->
	<xsl:template match="*[metadata/@semantictag='if-then-else']">
		<xsl:variable name="test">
			<xsl:value-of select="./asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<if-then-else>
			<xsl:attribute name="test"><xsl:value-of select="$test"/></xsl:attribute>
			<xsl:apply-templates select='asmUnitStructure'/>
		</if-then-else>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='then-part']">
		<then-part>
			<xsl:apply-templates select='asmUnitStructure'/>
		</then-part>		
	</xsl:template>
	<xsl:template match="*[metadata/@semantictag='else-part']">
		<else-part>
			<xsl:apply-templates select='asmUnitStructure'/>
		</else-part>		
	</xsl:template>
	<!-- ================ username ============================ -->
	<xsl:template match="*[metadata/@semantictag='username']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<username>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</username>
	</xsl:template>
	<!-- ================ firstname ============================ -->
	<xsl:template match="*[metadata/@semantictag='firstname']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<firstname>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</firstname>
	</xsl:template>
	<!-- ================ lastname ============================ -->
	<xsl:template match="*[metadata/@semantictag='lastname']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<lastname>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</lastname>
	</xsl:template>
	<!-- ================ firstname-lastname ============================ -->
	<xsl:template match="*[metadata/@semantictag='first-last-name']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="help">
			<xsl:value-of select="metadata-wad/@help"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<firstname-lastname>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($help='')">
				<xsl:attribute name="help"><xsl:value-of select="$help"/></xsl:attribute>
			</xsl:if>
		</firstname-lastname>
	</xsl:template>
	<!-- ================ text ============================ -->
	<xsl:template match="*[metadata/@semantictag='text']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<text>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:value-of select=".//asmContext[metadata/@semantictag='text-value']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</text>
	</xsl:template>
	<!-- ================ node-resource ============================ -->
	<xsl:template match="*[metadata/@semantictag='node_resource']">
		<xsl:variable name="editresroles">
			<xsl:value-of select="metadata-wad/@editresroles"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="delnoderoles">
			<xsl:value-of select="metadata-wad/@delnoderoles"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="todisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='todisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/>.<xsl:value-of select="$todisplay"/></xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<node_resource>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(editresroles='')">
				<xsl:attribute name="editresroles"><xsl:value-of select="$editresroles"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(delnoderoles='')">
				<xsl:attribute name="delnoderoles"><xsl:value-of select="$delnoderoles"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
		</node_resource>
	</xsl:template>
	<!-- ================ variable ============================ -->
	<xsl:template match="*[metadata/@semantictag='report-variable']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="varlabel">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='varlabel']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="todisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='todisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/>.<xsl:value-of select="$todisplay"/></xsl:variable>
		<xsl:variable name="aggregationselect">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='aggregationselect']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="aggregatetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='aggregatetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<variable>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($varlabel='')">
				<xsl:attribute name="varlabel"><xsl:value-of select="$varlabel"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($aggregationselect='..')">
				<xsl:attribute name="aggregationselect"><xsl:value-of select="$aggregationselect"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($aggregatetype='')">
				<xsl:attribute name="ref"><xsl:value-of select="$aggregatetype"/></xsl:attribute>
			</xsl:if>
			<xsl:value-of select=".//asmContext[metadata/@semantictag='text-value']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</variable>
	</xsl:template>
	<!-- ================ csv-line ============================ -->
	<xsl:template match="*[metadata/@semantictag='csv-line']">
		<csv-line>
			<xsl:apply-templates select='asmUnitStructure'/>
		</csv-line>
	</xsl:template>
	<!-- ================ csv-value ============================ -->
	<xsl:template match="*[metadata/@semantictag='csv-value']">
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="todisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='todisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/>.<xsl:value-of select="$todisplay"/></xsl:variable>
		<csv-value>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
		</csv-value>
	</xsl:template>
	<!-- ================ url2unit ============================ -->
	<xsl:template match="*[metadata/@semantictag='url2unit']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select">asmUnit.<xsl:value-of select="$semtag"/></xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<url2unit>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
		</url2unit>
	</xsl:template>
	<!-- ================ url2portfolio ============================ -->
	<xsl:template match="*[metadata/@semantictag='url2portfolio']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="code">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='code']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<url2portfolio>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($code='..')">
				<xsl:attribute name="code"><xsl:value-of select="$code"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
		</url2portfolio>
	</xsl:template>
	<!-- ================ JSFunction ============================ -->
	<xsl:template match="*[metadata/@semantictag='jsfunction']">
		<xsl:variable name="function">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='function']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<jsfunction>
			<xsl:if test="not($function='..')">
				<xsl:attribute name="function"><xsl:value-of select="$function"/></xsl:attribute>
			</xsl:if>
		</jsfunction>
	</xsl:template>
	<!-- ================ SVG ============================ -->
	<xsl:template match="*[metadata/@semantictag='model-svg']">
		<xsl:variable name="min-height">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='min-height']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="min-width">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='min-width']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<svg min-width='{$min-width}' min-height='{min-height}'>
			<xsl:apply-templates select='asmUnitStructure'/>
		</svg>
	</xsl:template>
	<!-- ================ for-each-person ============================ -->
	<xsl:template match="*[metadata/@semantictag='for-each-person']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="countvar">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='countvar']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select">
			<xsl:value-of select="asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<for-each-person select='{$select}'>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($countvar='')">
				<xsl:attribute name="countvar"><xsl:value-of select="$countvar"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-person>
	</xsl:template>
	<!-- ================ loop ============================ -->
	<xsl:template match="*[metadata/@semantictag='loop']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="variable">
			<xsl:value-of select="asmContext[metadata/@semantictag='variable']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<xsl:variable name="first">
			<xsl:value-of select="asmContext[metadata/@semantictag='first']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<xsl:variable name="last">
			<xsl:value-of select="asmContext[metadata/@semantictag='last']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<loop>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($variable='')">
				<xsl:attribute name="variable"><xsl:value-of select="$variable"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($first='')">
				<xsl:attribute name="first"><xsl:value-of select="$first"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($last='')">
				<xsl:attribute name="last"><xsl:value-of select="$last"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</loop>
	</xsl:template>
	<!-- ================ for-each-portfolio ============================ -->
	<xsl:template match="*[metadata/@semantictag='for-each-portfolio']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="countvar">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='countvar']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select">
			<xsl:value-of select="asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<xsl:variable name="sortag">
			<xsl:value-of select="asmContext[metadata/@semantictag='sortag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<xsl:variable name="sortelt">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='sortelt']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<for-each-portfolio select='{$select}'>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($countvar='')">
				<xsl:attribute name="countvar"><xsl:value-of select="$countvar"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(sortag='')">
				<xsl:attribute name="sortag"><xsl:value-of select="$sortag"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(sortelt='')">
				<xsl:attribute name="sortelt"><xsl:value-of select="$sortelt"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-portfolio>
	</xsl:template>
	<!-- ================ for-each-portfolios-nodes ============================ -->
	<xsl:template match="*[metadata/@semantictag='for-each-portfolios-nodes']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="countvar">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='countvar']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select">
			<xsl:value-of select="asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<xsl:variable name="sortag">
			<xsl:value-of select="asmContext[metadata/@semantictag='sortag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<xsl:variable name="sortelt">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='sortelt']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetag">
			<xsl:value-of select="asmContext[metadata/@semantictag='nodetag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<for-each-portfolios-nodes select='{$select}'>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($countvar='')">
				<xsl:attribute name="countvar"><xsl:value-of select="$countvar"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(sortag='')">
				<xsl:attribute name="sortag"><xsl:value-of select="$sortag"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(sortelt='')">
				<xsl:attribute name="sortelt"><xsl:value-of select="$sortelt"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(nodetag='')">
				<xsl:attribute name="nodetag"><xsl:value-of select="$nodetag"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-portfolios-nodes>
	</xsl:template>
	<!-- ================ for-each-line ============================ -->
	<xsl:template match="*[metadata/@semantictag='for-each-line']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="countvar">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='countvar']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<for-each-line>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($countvar='')">
				<xsl:attribute name="countvar"><xsl:value-of select="$countvar"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-line>
	</xsl:template>
	<!-- ================ for-each-node ============================ -->
	<xsl:template match="*[metadata/@semantictag='for-each-node']">
		<xsl:variable name="ref-init">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref-init']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="countvar">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='countvar']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/></xsl:variable>
		<for-each-node>
			<xsl:if test="not($ref-init='')">
				<xsl:attribute name="ref-init"><xsl:value-of select="$ref-init"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($countvar='')">
				<xsl:attribute name="countvar"><xsl:value-of select="$countvar"/></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			<xsl:attribute name="test"><xsl:value-of select="$test"/></xsl:attribute>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-node>
	</xsl:template>
	<!-- ================ aggregate ============================ -->
	<xsl:template match="*[metadata/@semantictag='aggregate']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='aggregationselect']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="type">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='aggregatetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<aggregate>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			<xsl:attribute name="type"><xsl:value-of select="$type"/></xsl:attribute>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</aggregate>
	</xsl:template>
	<!-- ================ operation ============================ -->
	<xsl:template match="*[metadata/@semantictag='operation']">
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select1">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='operationselect1']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select2">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='operationselect2']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="type">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='operationtype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<operation>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="select1"><xsl:value-of select="$select1"/></xsl:attribute>
			<xsl:attribute name="select2"><xsl:value-of select="$select2"/></xsl:attribute>
			<xsl:attribute name="type"><xsl:value-of select="$type"/></xsl:attribute>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select='asmUnitStructure'/>
		</operation>
	</xsl:template>
	<!-- ================ GoParent ============================ -->
	<xsl:template match="*[metadata/@semantictag='go-parent']">
		<goparent>
			<xsl:apply-templates select='asmUnitStructure'/>
		</goparent>
	</xsl:template>
	<!-- ================ show-sharing ============================ -->
	<xsl:template match="*[metadata/@semantictag='show-sharing']">
		<show-sharing>
		</show-sharing>
	</xsl:template>
	<!-- ================ display-sharing ============================ -->
	<xsl:template match="*[metadata/@semantictag='display-sharing']">
		<display-sharing>
		</display-sharing>
	</xsl:template>
	<!-- ================ draw-web-title ============================ -->
	<xsl:template match="*[metadata/@semantictag='draw-web-title']">
		<xsl:variable name="editresroles">
			<xsl:value-of select="metadata-wad/@editresroles"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="todisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='todisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/>.<xsl:value-of select="$todisplay"/></xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<draw-web-title>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(editresroles='')">
				<xsl:attribute name="editresroles"><xsl:value-of select="$editresroles"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
		</draw-web-title>
	</xsl:template>
	
	<!-- ================ draw-web-axis ============================ -->
	<xsl:template match="*[metadata/@semantictag='draw-web-axis']">
		<xsl:variable name="editresroles">
			<xsl:value-of select="metadata-wad/@editresroles"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="todisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='todisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/>.<xsl:value-of select="$todisplay"/></xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<draw-web-axis>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(editresroles='')">
				<xsl:attribute name="editresroles"><xsl:value-of select="$editresroles"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
		</draw-web-axis>
	</xsl:template>
	<!-- ================ draw-web-line ============================ -->
	<xsl:template match="*[metadata/@semantictag='draw-web-line']">
		<xsl:variable name="editresroles">
			<xsl:value-of select="metadata-wad/@editresroles"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="nodetype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='nodetype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="semtag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="todisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='todisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="min">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='value-min']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="max">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='value-max']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="pos">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='position']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="legendtype">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='legendtype']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="legendsemantictag">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='legendsemantictag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="legenddisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='legenddisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="select"><xsl:value-of select="$nodetype"/>.<xsl:value-of select="$semtag"/>.<xsl:value-of select="$todisplay"/></xsl:variable>
		<xsl:variable name="legendselect"><xsl:value-of select="$legendtype"/>.<xsl:value-of select="$legendsemantictag"/>.<xsl:value-of select="$legenddisplay"/></xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<draw-web-line>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(editresroles='')">
				<xsl:attribute name="editresroles"><xsl:value-of select="$editresroles"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($select='..')">
				<xsl:attribute name="select"><xsl:value-of select="$select"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($legendselect='..')">
				<xsl:attribute name="legendselect"><xsl:value-of select="$legendselect"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($min='..')">
				<xsl:attribute name="min"><xsl:value-of select="$min"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($pos='..')">
				<xsl:attribute name="pos"><xsl:value-of select="$pos"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($max='..')">
				<xsl:attribute name="max"><xsl:value-of select="$max"/></xsl:attribute>
			</xsl:if>
		</draw-web-line>
	</xsl:template>
	<!-- ================ draw-xy-axis ============================ -->
	<xsl:template match="*[metadata/@semantictag='draw-xy-axis']">
		<xsl:variable name="editresroles">
			<xsl:value-of select="metadata-wad/@editresroles"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="style">
			<xsl:call-template name="style"/>
		</xsl:variable>
		<xsl:variable name="ref">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='ref']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="xmin">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='value-xmin']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="xmax">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='value-xmax']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="ymin">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='value-ymin']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="ymax">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='value-ymax']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="legenddisplay">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='legenddisplay']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="class">
			<xsl:call-template name="class"/>
		</xsl:variable>
		<draw-xy-axis>
			<xsl:if test="not($class='')">
				<xsl:attribute name="class"><xsl:value-of select="$class"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not(editresroles='')">
				<xsl:attribute name="editresroles"><xsl:value-of select="$editresroles"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ref='')">
				<xsl:attribute name="ref"><xsl:value-of select="$ref"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($style='..')">
				<xsl:attribute name="style"><xsl:value-of select="$style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($xmin='..')">
				<xsl:attribute name="xmin"><xsl:value-of select="$xmin"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($xmax='..')">
				<xsl:attribute name="xmax"><xsl:value-of select="$xmax"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ymin='..')">
				<xsl:attribute name="xmin"><xsl:value-of select="$ymin"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="not($ymax='..')">
				<xsl:attribute name="ymax"><xsl:value-of select="$ymax"/></xsl:attribute>
			</xsl:if>
		</draw-xy-axis>
	</xsl:template>

	<!-- ================ asmNop ============================ -->
	<xsl:template match="*[metadata/@semantictag='asmNop']">
	</xsl:template>

	<!-- ==================================================== -->
	<!-- ==================================================== -->
	<!-- ==================================================== -->

	<xsl:template match="*">
	</xsl:template>
	
	<!-- ==================================================== -->
	<!-- ==================================================== -->
	<!-- ==================================================== -->

	<xsl:template name="class">
		<xsl:value-of select="metadata-epm/@cssclass"/>
	</xsl:template>
	
	<xsl:template name="style">
		<xsl:variable name="padding-top">
			<xsl:value-of select="metadata-epm/@node-padding-top"/>
		</xsl:variable>
		<xsl:variable name="text-align">
			<xsl:value-of select="metadata-epm/@node-text-align"/>
		</xsl:variable>
		<xsl:variable name="font-style">
			<xsl:value-of select="metadata-epm/@node-font-style"/>
		</xsl:variable>
		<xsl:variable name="font-weight">
			<xsl:value-of select="metadata-epm/@node-font-weight"/>
		</xsl:variable>
		<xsl:variable name="font-size">
			<xsl:value-of select="metadata-epm/@node-font-size"/>
		</xsl:variable>
		<xsl:variable name="background-color">
			<xsl:value-of select="metadata-epm/@node-background-color"/>
		</xsl:variable>
		<xsl:variable name="color">
			<xsl:value-of select="metadata-epm/@node-color"/>
		</xsl:variable>
		<xsl:variable name="othercss">
			<xsl:value-of select="metadata-epm/@node-othercss"/>
		</xsl:variable>
		<xsl:if test="not($padding-top='')">padding-top:<xsl:value-of select="$padding-top"/>;</xsl:if>
		<xsl:if test="not($text-align='')">text-align:<xsl:value-of select="$text-align"/>;</xsl:if>
		<xsl:if test="not($font-style='')">font-style:<xsl:value-of select="$font-style"/>;</xsl:if>
		<xsl:if test="not($font-weight='')">font-weight:<xsl:value-of select="$font-weight"/>;</xsl:if>
		<xsl:if test="not($font-size='')">font-size:<xsl:value-of select="$font-size"/>;</xsl:if>
		<xsl:if test="not($background-color='')">background-color:<xsl:value-of select="$background-color"/>;</xsl:if>
		<xsl:if test="not($color='')">color:<xsl:value-of select="$color"/>;</xsl:if>
		<xsl:if test="not($othercss='')"><xsl:value-of select="$othercss"/></xsl:if>
	</xsl:template>

</xsl:stylesheet>

 