<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<xsl:output method="xml" />
	<xsl:param name="lang">fr</xsl:param>
	<xsl:template match="/">
		<model>
			<xsl:apply-templates select='//asmRoot/asmUnitStructure'/>
		</model>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='for-each-line']">
		<for-each-line>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-line>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='if-then-else']">
		<if-then-else>
			<xsl:apply-templates select='asmUnitStructure'/>
		</if-then-else>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='if-action']">
		<if-part>
			<xsl:apply-templates select='asmUnitStructure'/>
		</if-part>		
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



	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ PERSON ============================================== -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->

	<xsl:template match="*[metadata/@semantictag='for-each-person']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='personid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<for-each-user id="{$id}">
			<email>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">email</xsl:with-param>
				</xsl:call-template>
			</email>
			<username>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">username</xsl:with-param>
				</xsl:call-template>
			</username>
			<actions>
				<xsl:apply-templates select='asmUnitStructure'/>
			</actions>
		</for-each-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='create-person']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="firstname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='firstname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="lastname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='lastname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="email">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='email']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="password">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='password']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="other">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='other']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="designer">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='designer']/asmResource[@xsi_type='Get_Resource']/code"></xsl:value-of>
		</xsl:variable>
		<create-user>
			<identifier>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">identifier</xsl:with-param>
				</xsl:call-template>
				<txtval select='{$identifier}'/>
			</identifier>
			<firstname>
				<txtval select='{$firstname}'/>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">firstname</xsl:with-param>
				</xsl:call-template>
			</firstname>
			<lastname>
				<txtval select='{$lastname}'/>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">lastname</xsl:with-param>
				</xsl:call-template>
			</lastname>
			<email>
				<txtval select='{$email}'/>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">email</xsl:with-param>
				</xsl:call-template>
			</email>
			<password>
				<txtval select='{$password}'/>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">password</xsl:with-param>
				</xsl:call-template>
			</password>
			<other>
				<txtval><xsl:value-of select="$other"/></txtval>
			</other>
			<designer>
				<txtval><xsl:value-of select="$designer"/></txtval>
			</designer>
		</create-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='delete-person']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='user-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
			<delete-user select="{$select}">
			<identifier>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">identifier</xsl:with-param>
				</xsl:call-template>
			</identifier>
		</delete-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='activate-person']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='user-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<activate-user select="{$select}">
			<identifier>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">identifier</xsl:with-param>
				</xsl:call-template>
			</identifier>
		</activate-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='inactivate-person']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='user-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<inactivate-user select="{$select}">
			<identifier>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">identifier</xsl:with-param>
				</xsl:call-template>
			</identifier>
		</inactivate-user>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ TREE ================================================ -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	
	<xsl:template match="*[metadata/@semantictag='for-each-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<for-each-tree id="{$id}">
			<code>
				<xsl:call-template name="txtval"><xsl:with-param name="semtag">code</xsl:with-param></xsl:call-template>
			</code>
			<actions>
				<xsl:apply-templates select='asmUnitStructure'/>
			</actions>
		</for-each-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='create-tree' or metadata/@semantictag='create-project']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-tree id="{$id}">
			<template>
				<xsl:call-template name="txtval"><xsl:with-param name="semtag">tree-template</xsl:with-param></xsl:call-template>
				<xsl:call-template name="varval"><xsl:with-param name="semtag">tree-template</xsl:with-param></xsl:call-template>
			</template>
			<code>
				<xsl:call-template name="txtval"><xsl:with-param name="semtag">tree-code</xsl:with-param></xsl:call-template>
				<xsl:call-template name="varval"><xsl:with-param name="semtag">tree-code</xsl:with-param></xsl:call-template>
			</code>
			<label>
				<xsl:call-template name="txtval"><xsl:with-param name="semtag">tree-label</xsl:with-param></xsl:call-template>
				<xsl:call-template name="varval"><xsl:with-param name="semtag">tree-label</xsl:with-param></xsl:call-template>
			</label>
		</create-tree>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='select-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
		</xsl:variable>
		<select-tree id="{$id}">
			<code>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">code</xsl:with-param>
				</xsl:call-template>
		</code>
		</select-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='delete-tree']">
		<delete-tree>
			<code>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">code</xsl:with-param>
				</xsl:call-template>
			</code>
		</delete-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='refresh-tree-url2unit']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<refresh-tree-url2unit  select="{$select}">
		</refresh-tree-url2unit>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='refresh-tree-url2portfolio']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<refresh-tree-url2portfolio  select="{$select}">
		</refresh-tree-url2portfolio>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='share-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<share-tree select="{$id}">
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</share-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='unshare-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<unshare-tree select="{$id}">
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</unshare-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='re-instantiate-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<re-instantiate-tree select="{$id}"/>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='set-owner']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<set-owner select="{$id}">
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
		</set-owner>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-tree-root']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-tree-root id="{$id}">
			<oldcode>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-oldcode</xsl:with-param>
				</xsl:call-template>
			</oldcode>
			<newcode>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-newcode</xsl:with-param>
				</xsl:call-template>
			</newcode>
			<label>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-label</xsl:with-param>
				</xsl:call-template>
			</label>
		</update-tree-root>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ PORTFOLIOGROUP ====================================== -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	
	<xsl:template match="*[metadata/@semantictag='join-portfoliogroup']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<join-portfoliogroup select="{$select}">
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
		</join-portfoliogroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='leave-portfoliogroup']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<leave-portfoliogroup select="{$id}">
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
		</leave-portfoliogroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='share-portfoliogroup']">
		<share-portfoliogroup>
			<identifier>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">identifier</xsl:with-param>
				</xsl:call-template>
			</identifier>
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">portfoliogroup</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</share-portfoliogroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='unshare-portfoliogroup']">
		<unshare-portfoliogroup>
			<identifier>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">identifier</xsl:with-param>
				</xsl:call-template>
			</identifier>
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">portfoliogroup</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</unshare-portfoliogroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='create-portfoliogroup']">
		<xsl:variable name="portfoliogroup">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='portfoliogroup']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-portfoliogroup>
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">portfoliogroup</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
		</create-portfoliogroup>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ NODE ================================================ -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	
	<xsl:template match="*[metadata/@semantictag='moveup-node']">
		<xsl:variable name="destination">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<moveup-node select="{$destination}">
		</moveup-node>
	</xsl:template>


	<xsl:template match="*[metadata/@semantictag='delete-node']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<delete-node select="{$select}">
		</delete-node>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-node-resource']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node-resource type='NodeResource' select="{$select}" test="{$test}">
			<newcode>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">node-code</xsl:with-param>
				</xsl:call-template>
			</newcode>
			<label>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">node-label</xsl:with-param>
				</xsl:call-template>
			</label>
		</update-node-resource>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='import-node']">
		<xsl:variable name="destination">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-source</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="old-source">#<xsl:call-template name="txtval"><xsl:with-param name="semtag">import-source</xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:variable name="dest"><xsl:value-of select=".//asmContext[metadata/@semantictag='destination-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="srce"><xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<import-node select="{$destination}{$dest}" source="{$srce}{$old-source}">
			<source>
				<xsl:value-of select='$source'/>
			</source>
		</import-node>
	</xsl:template>
	
	
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ UPDATE RESOURCE ===================================== -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	
	<xsl:template match="*[metadata/@semantictag='update-resource']">
			<xsl:apply-templates select='asmUnitStructure'/>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-field']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Field' select="{$select}" test="{$test}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<attribute name='text' language-dependent='Y'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-textfield']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='TextField' select="{$select}" test="{$test}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<attribute name="text" language-dependent='Y'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
	</xsl:template>
	
	
	<xsl:template match="*[metadata/@semantictag='update-calendar']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Calendar' select="{$select}" test="{$test}">
			<attribute name='minViewMode' language-dependent='N'>
				<txtval>
					<xsl:value-of select=".//asmContext[metadata/@semantictag='minViewMode']/asmResource[@xsi_type='Field']/text"></xsl:value-of>
				</txtval>
			</attribute>
			<attribute name='format' language-dependent='Y'>
				<txtval>
					<xsl:value-of select=".//asmContext[metadata/@semantictag='format']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
				</txtval>
			</attribute>
			<attribute name='text' language-dependent='Y'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">date</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='update-variable']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="variable-name">
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">variable-name</xsl:with-param>
				</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Variable' select="{$select}" test="{$test}">
			<xsl:if test="$variable-name!=''">
				<attribute name='name' language-dependent='N'>
					<txtval>
						<xsl:value-of select='$variable-name'/>
					</txtval>
				</attribute>
			</xsl:if>
			<attribute name='value' language-dependent='N'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">variable-value</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
		<xsl:if test="$variable-name!=''">
			<update-node type='Metadata' select="{$select}" attribute="semantictag" test="{$test}">
				<text>
					<txtval>g-variable <xsl:value-of select='$variable-name'/></txtval>
				</text>
			</update-node>
		</xsl:if>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-document']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Document' select="{$select}" test="{$test}">
			<attribute name='filename' language-dependent='Y'>
				<xsl:value-of select=".//asmContext[metadata/@semantictag='filename']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
			</attribute>
			<attribute name='size' language-dependent='Y'>
				<xsl:value-of select=".//asmContext[metadata/@semantictag='size']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
			</attribute>
			<attribute name='type' language-dependent='Y'>
				<xsl:value-of select=".//asmContext[metadata/@semantictag='type']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
			</attribute>
			<attribute name='fileid' language-dependent='Y'>
				<xsl:value-of select=".//asmContext[metadata/@semantictag='fileid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
			</attribute>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-proxy']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-source</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-proxy type='Proxy' select="{$select}" test="{$test}">
			<source select="{$source}"/>
		</update-proxy>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-url2unit']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-source</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-url2unit type='URL2Unit' select="{$select}" test="{$test}">
			<source select="{$source}"/>
		</update-url2unit>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-url2portfolio']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-url2portfolio type='URL2Portfolio' select="{$select}" test="{$test}">
			<source select="{$source}"/>
		</update-url2portfolio>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-dashboard']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Dashboard' select="{$select}" test="{$test}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<attribute name='text' language-dependent='Y'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-item']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Item' select="{$select}" test="{$test}">
			<attribute name='code' language-dependent='N'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">code</xsl:with-param>
				</xsl:call-template>
			</attribute>
			<attribute name='label' language-dependent='Y'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">libelle</xsl:with-param>
				</xsl:call-template>
			</attribute>
			<attribute name='code' language-dependent='N'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">value</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-color']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Color' select="{$select}" test="{$test}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<attribute name='text' language-dependent='Y'>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</attribute>
		</update-resource>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ USERGROUP =========================================== -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->

	
		<xsl:template match="*[metadata/@semantictag='create-usergroup']">
		<create-usergroup>
			<usergroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">usergroup</xsl:with-param>
				</xsl:call-template>
			</usergroup>
		</create-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='share-usergroup']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<share-usergroup select="{$id}">
			<groupname>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</groupname>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</share-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='unshare-usergroup']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<unshare-usergroup select="{$id}">
			<groupname>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</groupname>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</unshare-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='join-usergroup']">
		<join-usergroup>
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<usergroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">usergroup</xsl:with-param>
				</xsl:call-template>
			</usergroup>
		</join-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='leave-usergroup']">
		<leave-usergroup>
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<usergroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">usergroup</xsl:with-param>
				</xsl:call-template>
			</usergroup>
		</leave-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='share-groups']">
		<share-groups>
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">portfoliogroup</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
			<usergroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">usergroup</xsl:with-param>
				</xsl:call-template>
			</usergroup>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</share-groups>
	</xsl:template>
	
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ METADATA ============================================ -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	
		<xsl:template match="*[metadata/@semantictag='update-rights']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="role">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='role']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="rd">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='rd']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="wr">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='wr']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="dl">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='dl']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="sb">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='sb']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-rights type="Rights" select="{$select}" role="{$role}" rd="{$rd}" wr="{$wr}" dl="{$dl}" sb="{$sb}"/>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='update-metadata']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="attribute">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='attribute']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node type='Metadata' select="{$select}" attribute="{$attribute}" test="{$test}">
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-node>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='update-metadata-wad']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="attribute">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='attribute']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node type='Metadatawad' select="{$select}" attribute="{$attribute}" test="{$test}">
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-node>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='update-metadata-epm']">
		<xsl:variable name="select">
			<xsl:call-template name='get-select'>
				<xsl:with-param name='parent'>subsection-target</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="attribute">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='attribute']/asmResource[@xsi_type='Get_Resource']/value"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="test">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='test']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node type='Metadataepm' select="{$select}" attribute="{$attribute}" test="{$test}">
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-node>
	</xsl:template>
	
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ get-select ========================================== -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->

	<xsl:template name="get-select">
		<xsl:param name="parent"/>
		<xsl:variable name="select"><xsl:value-of select=".//*[metadata/@semantictag=$parent]//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="ref-id"><xsl:value-of select=".//*[metadata/@semantictag=$parent]//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="portfoliocode">#<xsl:value-of select=".//*[metadata/@semantictag=$parent]//asmContext[metadata/@semantictag='portfoliocode']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="semtag"><xsl:value-of select=".//*[metadata/@semantictag=$parent]//asmContext[metadata/@semantictag='node-semtag']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="varname"><xsl:value-of select=".//*[metadata/@semantictag=$parent]//asmContext[metadata/@semantictag='variable-name']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="uuid"><xsl:value-of select=".//*[metadata/@semantictag=$parent]//asmContext[metadata/@semantictag='uuid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<!-- for backward compatibility -->
		<xsl:variable name="old-select"><xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<xsl:variable name="old-tree-select"><xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of></xsl:variable>
		<!-- ==================================== -->
		 <!--===parent:<xsl:value-of select='$parent'/>===old-tree-select:<xsl:value-of select='$old-tree-select'/>===old-select:<xsl:value-of select='$old-select'/>===uuid:<xsl:value-of select='$uuid'/>===select:<xsl:value-of select='$select'/>===ref-id:<xsl:value-of select='$ref-id'/>===portfoliocode:<xsl:value-of select='$portfoliocode'/>===semtag:<xsl:value-of select='$semtag'/>=== -->
		<xsl:choose>
			<xsl:when test="$select=''">
				<xsl:choose>
					<xsl:when test="$ref-id=''">
						<xsl:choose>
							<xsl:when test="$uuid=''">
								<xsl:choose>
									<xsl:when test="$portfoliocode!='#'">
										<xsl:choose>
											<xsl:when test="$semtag=''"><xsl:value-of select='$portfoliocode'/></xsl:when>
											<xsl:when test="$semtag!=''"><xsl:value-of select='$portfoliocode'/>.<xsl:value-of select='$semtag'/></xsl:when>
										</xsl:choose>
									</xsl:when>
									<xsl:when test="$old-select!=''"><xsl:value-of select='$old-select'/></xsl:when>
									<xsl:when test="$old-tree-select!=''"><xsl:value-of select='$old-tree-select'/></xsl:when>
									<xsl:when test="$semtag!=''"><xsl:value-of select='$semtag'/></xsl:when>
									<xsl:otherwise></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select='$uuid'/>.#uuid</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="$semtag=''"><xsl:value-of select='$ref-id'/>.<xsl:value-of select='$varname'/></xsl:when>
							<xsl:otherwise><xsl:value-of select='$ref-id'/>.<xsl:value-of select='$semtag'/></xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select='$select'/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ txtval ============================================== -->
	<!-- ====================================================================================== -->

	<xsl:template name='txtval'>
		<xsl:param name="semtag"/>
		<xsl:for-each select=".//*[metadata/@semantictag=$semtag]/*[metadata/@semantictag='txtchoice' or metadata/@semantictag='txtsel' or metadata/@semantictag='txtval' or metadata/@semantictag='textval' or metadata/@semantictag='usersel']">
			<xsl:if test="metadata/@semantictag='txtchoice'">
				<xsl:variable name="txtchoice">
					<xsl:value-of select="asmResource[@xsi_type='Get_Get_Resource']/value"/>
				</xsl:variable>
				<txtval><xsl:value-of select="$txtchoice"/></txtval>
			</xsl:if>
			<xsl:if test="metadata/@semantictag='txtsel'">
				<xsl:variable name="txtsel">
					<xsl:value-of select="asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
				</xsl:variable>
				<txtval select='{$txtsel}'/>
			</xsl:if>
			<xsl:if test="metadata/@semantictag='txtval'">
				<xsl:variable name="txtval"> 
					<xsl:value-of select="asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
				</xsl:variable>
				<txtval><xsl:value-of select="$txtval"/></txtval>
			</xsl:if>
			<xsl:if test="metadata/@semantictag='textval'">
				<xsl:variable name="txtval"> 
					<xsl:value-of select="asmResource[@xsi_type='TextField']/text[@lang=$lang]"/>
				</xsl:variable>
				<txtval><xsl:value-of select="$txtval"/></txtval>
			</xsl:if>
			<xsl:if test="metadata/@semantictag='usersel'">
				<xsl:variable name="usrsel">/<xsl:value-of select="asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of></xsl:variable>
				<txtval select='{$usrsel}'/>
			</xsl:if>
			
		</xsl:for-each>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- ================================ varval ============================================== -->
	<!-- ====================================================================================== -->

	<xsl:template name='varval'>
		<xsl:param name="semtag"/>
		<xsl:variable name="varval"><xsl:value-of select=".//*[metadata/@semantictag=$semtag]/*[metadata/@semantictag='varval']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of></xsl:variable>
		<varval><xsl:value-of select="$varval"/></varval>
	</xsl:template>

	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->
	<!-- old for compatibility 2018/10/29 -->
	<!-- ====================================================================================== -->
	<!-- ====================================================================================== -->

	<xsl:template match="*[metadata/@semantictag='update-field-byid']">
		<update-field-byid>
			<uuid>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">uuid</xsl:with-param>
				</xsl:call-template>
			</uuid>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-field-byid>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='delete-node-byid']">
		<delete-node-byid>
			<uuid>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">uuid</xsl:with-param>
				</xsl:call-template>
			</uuid>
		</delete-node-byid>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='reset-document-byid']">
		<reset-document-byid>
			<uuid>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">uuid</xsl:with-param>
				</xsl:call-template>
			</uuid>
		</reset-document-byid>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-query']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node type='Metadatawad' select="{$select}" attribute="query">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-node>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-menu']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node type='Metadatawad' select="{$select}" attribute='menuroles'>
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-node>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-inline']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-node type='Metadata' select="{$select}" attribute="inline">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-node>
	</xsl:template>
	
		<xsl:template match="*[metadata/@semantictag='create-elgg-user']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="firstname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='firstname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="lastname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='lastname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="email">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='email']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="password">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='password']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-elgg-user>
			<identifier>
				<txtval select='{$identifier}'/>
			</identifier>
			<firstname>
				<txtval select='{$firstname}'/>
			</firstname>
			<lastname>
				<txtval select='{$lastname}'/>
			</lastname>
			<email>
				<txtval select='{$email}'/>
			</email>
			<password>
				<txtval select='{$password}'/>
			</password>
		</create-elgg-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='join-elgg-group']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<join-elgg-group>
			<identifier>
				<txtval select='{$identifier}'/>
			</identifier>
			<group>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">group</xsl:with-param>
				</xsl:call-template>
			</group>
		</join-elgg-group>
	</xsl:template>
		
	<xsl:template match="*[metadata/@semantictag='create-elgg-group']">
		<xsl:variable name="group">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='group']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-elgg-group>
			<group>
				<txtval select='{group}'/>
			</group>
		</create-elgg-group>
	</xsl:template>

	<xsl:template match="text()"/>
</xsl:stylesheet>

 
