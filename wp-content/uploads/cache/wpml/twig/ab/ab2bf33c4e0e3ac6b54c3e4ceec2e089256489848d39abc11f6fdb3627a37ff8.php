<?php

/* tooltip.twig */
class __TwigTemplate_d2583d637277e8348787d8c4dc5bfacfce8ca62dae55e4884e145076178a638a extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<a href=\"#\" class=\"js-wpml-ls-tooltip-open wpml-ls-tooltip-open otgs-ico-help\" data-content=\"";
        echo twig_escape_filter($this->env, $this->getAttribute((isset($context["content"]) ? $context["content"] : null), "text", array()), "html_attr");
        echo "\" data-link-text=\"";
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["content"]) ? $context["content"] : null), "link", array()), "text", array()), "html_attr");
        echo "\" data-link-url=\"";
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["content"]) ? $context["content"] : null), "link", array()), "url", array()), "html_attr");
        echo "\" data-link-target=\"";
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["content"]) ? $context["content"] : null), "link", array()), "target", array()), "html_attr");
        echo "\"></a>";
    }

    public function getTemplateName()
    {
        return "tooltip.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "tooltip.twig", "/home/vg2peww8/public_html/wp-content/plugins/sitepress-multilingual-cms/templates/language-switcher-admin-ui/tooltip.twig");
    }
}
