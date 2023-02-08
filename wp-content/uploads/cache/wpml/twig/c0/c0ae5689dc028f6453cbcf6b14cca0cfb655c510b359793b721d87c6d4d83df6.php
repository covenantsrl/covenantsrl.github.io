<?php

/* section-post-translations.twig */
class __TwigTemplate_ea32bb23124547e18d74d60a92a70f55c1557bd9cf9bb8b23bd46cd170ff66a8 extends Twig_Template
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
        echo "<p class=\"wpml-ls-form-line js-wpml-ls-option\">
    <label for=\"wpml-ls-show-in-post-translations\">
        <input type=\"checkbox\" id=\"wpml-ls-show-in-post-translations\" name=\"statics[post_translations][show]\" value=\"1\"
               class=\"js-wpml-ls-toggle-slot js-wpml-ls-trigger-save\" data-target=\".js-wpml-ls-post-translations-toggle-target\"
               ";
        // line 5
        if ($this->getAttribute($this->getAttribute($this->getAttribute((isset($context["settings"]) ? $context["settings"] : null), "statics", array()), "post_translations", array()), "show", array())) {
            echo "checked=\"checked\"";
        }
        echo "/>
        ";
        // line 6
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute((isset($context["strings"]) ? $context["strings"] : null), "post_translations", array()), "show", array()), "html", null, true);
        echo "
    </label>

    ";
        // line 9
        $this->loadTemplate("save-notification.twig", "section-post-translations.twig", 9)->display($context);
        // line 10
        echo "</p>

<div class=\"js-wpml-ls-post-translations-toggle-target alignleft";
        // line 12
        if (($this->getAttribute($this->getAttribute($this->getAttribute((isset($context["settings"]) ? $context["settings"] : null), "statics", array()), "post_translations", array()), "show", array()) != 1)) {
            echo " hidden";
        }
        echo "\">

    ";
        // line 14
        $context["slot_settings"] = array();
        // line 15
        echo "    ";
        $context["slot_settings"] = twig_array_merge((isset($context["slot_settings"]) ? $context["slot_settings"] : null), array("post_translations" => $this->getAttribute($this->getAttribute((isset($context["settings"]) ? $context["settings"] : null), "statics", array()), "post_translations", array())));
        // line 16
        echo "
    ";
        // line 17
        $this->loadTemplate("table-slots.twig", "section-post-translations.twig", 17)->display(array_merge($context, array("slot_type" => "statics", "slots_settings" =>         // line 20
(isset($context["slot_settings"]) ? $context["slot_settings"] : null), "slug" => "post_translations")));
        // line 24
        echo "
</div>";
    }

    public function getTemplateName()
    {
        return "section-post-translations.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  61 => 24,  59 => 20,  58 => 17,  55 => 16,  52 => 15,  50 => 14,  43 => 12,  39 => 10,  37 => 9,  31 => 6,  25 => 5,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "section-post-translations.twig", "/home/vg2peww8/public_html/wp-content/plugins/sitepress-multilingual-cms/templates/language-switcher-admin-ui/section-post-translations.twig");
    }
}
